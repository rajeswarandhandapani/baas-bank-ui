import { test, expect, Page, APIRequestContext } from '@playwright/test';
import fs from 'node:fs';

async function token(
  request: APIRequestContext,
  username: string,
  password = 'user123',
) {
  const response = await request.post(
    'http://localhost:8089/realms/baas/protocol/openid-connect/token',
    {
      form: {
        client_id: 'banking-app',
        grant_type: 'password',
        username,
        password,
      },
    },
  );
  expect(response.ok()).toBeTruthy();
  return (await response.json()).access_token as string;
}
async function accounts(request: APIRequestContext, accessToken: string) {
  const response = await request.get(
    'http://localhost:8080/api/accounts/my-accounts',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  expect(response.ok()).toBeTruthy();
  return response.json();
}
async function onboard(request: APIRequestContext, accessToken: string) {
  if (!(await accounts(request, accessToken)).length) {
    const response = await request.post(
      'http://localhost:8080/api/saga/start/user-onboarding',
      { headers: { Authorization: `Bearer ${accessToken}` }, data: {} },
    );
    expect(response.status()).toBe(202);
    await expect
      .poll(async () => (await accounts(request, accessToken)).length, {
        timeout: 30000,
      })
      .toBeGreaterThan(0);
  }
}
async function login(page: Page, username = 'johndoe', password = 'user123') {
  await page.goto('/');
  await page.getByRole('button', { name: /^Sign in/ }).click();
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#kc-login').click();
  await expect(page).toHaveURL(
    username === 'baas-admin' ? /\/admin$/ : /\/dashboard$/,
  );
}

test('real banking journey: sign-in, accounts, payment, activity and mobile layout', async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  fs.mkdirSync('artifacts', { recursive: true });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const john = await token(request, 'johndoe');
  const james = await token(request, 'james');
  await onboard(request, john);
  await onboard(request, james);
  const source = (await accounts(request, john))[0];
  const destination = (await accounts(request, james))[0];
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Banking that/ }),
  ).toBeVisible();
  await page.screenshot({
    path: 'artifacts/welcome-desktop.png',
    fullPage: true,
  });
  await login(page);
  await expect(
    page.getByRole('heading', { name: 'Hello, John.' }),
  ).toBeVisible();
  await expect(page.getByText('Loading your latest information…')).toHaveCount(
    0,
  );
  await page.screenshot({
    path: 'artifacts/dashboard-desktop.png',
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Accounts', exact: true }).click();
  await expect(
    page.getByText(source.accountNumber, { exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Payments', exact: true }).click();
  await page.getByRole('button', { name: 'Submit payment' }).click();
  await expect(page.getByText('Select a source account.')).toBeVisible();
  await page.getByLabel('From account').selectOption(source.accountNumber);
  await page
    .getByLabel('Destination account number')
    .fill(source.accountNumber);
  await page.getByLabel('Amount USD').fill('12.50');
  const description = `Visual test ${Date.now()}`;
  await page.getByLabel('What’s it for?').fill(description);
  await page.getByRole('button', { name: 'Submit payment' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'different destination' })).toBeVisible();
  await page
    .getByLabel('Destination account number')
    .fill(destination.accountNumber);
  await page.getByRole('button', { name: 'Submit payment' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Payment submitted' }),
  ).toBeVisible();
  await expect
    .poll(
      async () => {
        const res = await request.get(
          'http://localhost:8080/api/payments/my-payments',
          { headers: { Authorization: `Bearer ${john}` } },
        );
        const payment = (await res.json()).find(
          (p: { description: string }) => p.description === description,
        );
        return payment?.status;
      },
      { timeout: 40000 },
    )
    .toBe('COMPLETED');
  await expect
    .poll(async () => (await accounts(request, john))[0].balance)
    .toBeCloseTo(source.balance - 12.5, 2);
  await expect
    .poll(async () => (await accounts(request, james))[0].balance)
    .toBeCloseTo(destination.balance + 12.5, 2);
  await page.getByRole('button', { name: 'Refresh' }).click();
  await expect(
    page.getByRole('row').filter({ hasText: description }),
  ).toContainText('COMPLETED');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: 'artifacts/payments-desktop.png',
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Transactions', exact: true }).click();
  await page.getByRole('searchbox').fill(description);
  await expect(
    page.getByRole('row').filter({ hasText: description }),
  ).toBeVisible();
  await page.screenshot({
    path: 'artifacts/transactions-desktop.png',
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dashboard');
  await expect(
    page.getByRole('heading', { name: 'Hello, John.' }),
  ).toBeVisible();
  await expect(page.getByText('Loading your latest information…')).toHaveCount(
    0,
  );
  await page.screenshot({
    path: 'artifacts/dashboard-mobile.png',
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('link', { name: 'Payments', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Send a payment' }),
  ).toBeVisible();
  await page.screenshot({
    path: 'artifacts/payments-mobile.png',
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test('administrator sees live customers, balances and saga outcomes', async ({
  page,
}) => {
  await login(page, 'baas-admin', 'admin123');
  await expect(
    page.getByRole('heading', { name: 'Bank operations.' }),
  ).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await page.screenshot({
    path: 'artifacts/admin-desktop.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Sagas', exact: true }).click();
  await expect(page.getByRole('table')).toContainText('COMPLETED');
  await page.getByRole('button', { name: 'Customers', exact: true }).click();
  await expect(page.getByRole('table')).toContainText('johndoe');
});

test('loading failures offer a working retry and guest routes remain protected', async ({
  page,
}) => {
  await page.goto('/payments');
  await expect(page).toHaveURL('http://localhost:4200/');
  await login(page);
  await page.route('**/api/accounts/my-accounts', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  );
  await page.goto('/accounts');
  await expect(page.getByRole('alert')).toContainText('couldn’t load');
  await page.screenshot({
    path: 'artifacts/accounts-error.png',
    fullPage: true,
  });
  await page.unroute('**/api/accounts/my-accounts');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(
    page.getByText('Available balance', { exact: true }).first(),
  ).toBeVisible();
});
