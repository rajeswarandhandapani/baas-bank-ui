import { test, expect, Page, APIRequestContext } from '@playwright/test';
import fs from 'node:fs';
const gateway = 'http://localhost:18080';
async function token(request: APIRequestContext, user: string, password = 'user123') {
  const response = await request.post('http://localhost:18089/realms/baas/protocol/openid-connect/token', {form:{client_id:'banking-app',grant_type:'password',username:user,password}});
  expect(response.ok()).toBeTruthy(); return (await response.json()).access_token as string;
}
async function get(request: APIRequestContext, path: string, jwt: string) {
  const response = await request.get(gateway+path, {headers:{Authorization:`Bearer ${jwt}`}}); expect(response.ok()).toBeTruthy(); return response.json();
}
async function onboard(request: APIRequestContext, jwt: string) {
  const response = await request.post(gateway+'/api/users', {headers:{Authorization:`Bearer ${jwt}`},data:{}});
  expect(response.ok()).toBeTruthy();
  await expect.poll(async()=> (await get(request,'/api/accounts/my-accounts',jwt)).length, {timeout:40000}).toBeGreaterThan(0);
}
async function login(page: Page, user='user1', password='user123') {
  await page.goto('/'); await page.getByRole('button',{name:/^Sign in/}).click();
  await page.locator('#username').fill(user); await page.locator('#password').fill(password); await page.locator('#kc-login').click();
  await expect(page).toHaveURL(user==='baas-admin' ? /\/admin$/ : /\/dashboard$/);
}

test('choreographed payment reaches both accounts, ledger, notifications and audit', async({page,request})=>{
  test.setTimeout(120000); fs.mkdirSync('artifacts/choreographed',{recursive:true});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const john=await token(request,'user1'), james=await token(request,'user2');
  await onboard(request,john);await onboard(request,james);
  const source=(await get(request,'/api/accounts/my-accounts',john))[0], dest=(await get(request,'/api/accounts/my-accounts',james))[0];
  await login(page);
  await expect(page.getByText('Loading your latest information…')).toHaveCount(0);
  await page.screenshot({path:'artifacts/choreographed/dashboard-desktop.png',fullPage:true});
  await page.getByRole('link',{name:'Payments',exact:true}).click();
  await page.getByLabel('From account').selectOption(source.accountNumber);
  await page.getByLabel('Destination account number').fill(dest.accountNumber);
  await page.getByLabel('Amount USD').fill('12.50');
  const description=`Choreography test ${Date.now()}`;
  await page.getByLabel('What’s it for?').fill(description);
  await page.getByRole('button',{name:'Submit payment'}).click();
  await expect(page.getByRole('status').filter({hasText:'Payment submitted'})).toBeVisible();
  let paymentId:number;
  await expect.poll(async()=>{
    const p=(await get(request,'/api/payments/my-payments',john)).find((p:any)=>p.description===description);
    paymentId=p?.id;return p?.status;
  },{timeout:40000}).toBe('PROCESSED');
  expect((await get(request,'/api/accounts/my-accounts',john))[0].balance).toBeCloseTo(source.balance-12.5,2);
  expect((await get(request,'/api/accounts/my-accounts',james))[0].balance).toBeCloseTo(dest.balance+12.5,2);
  await expect.poll(async()=> (await get(request,'/api/transactions/my-transactions',john)).filter((t:any)=>t.reference===String(paymentId)).length).toBe(1);
  await expect.poll(async()=> (await get(request,'/api/transactions/my-transactions',james)).filter((t:any)=>t.reference===String(paymentId)).length).toBe(1);
  await page.getByRole('button',{name:'Refresh'}).click();
  await expect(page.getByRole('row').filter({hasText:description})).toContainText('PROCESSED');
  await page.evaluate(()=>scrollTo(0,0)); await page.screenshot({path:'artifacts/choreographed/payments-desktop.png',fullPage:true});
  await page.getByRole('link',{name:'Transactions',exact:true}).click();await page.getByRole('searchbox').fill(description);
  await expect(page.getByRole('row').filter({hasText:description})).toBeVisible();
  await page.screenshot({path:'artifacts/choreographed/transactions-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.goto('/dashboard');
  await expect(page.getByText('Loading your latest information…')).toHaveCount(0);
  await page.screenshot({path:'artifacts/choreographed/dashboard-mobile.png',fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Menu'}).click();await page.getByRole('link',{name:'Payments',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Send a payment'})).toBeVisible();
  await page.screenshot({path:'artifacts/choreographed/payments-mobile.png',fullPage:true});
  const admin=await token(request,'baas-admin','admin123');
  await expect.poll(async()=> (await get(request,'/api/audit-logs',admin)).filter((a:any)=>a.eventType==='TRANSACTION_RECORDED' && a.details.includes(String(paymentId))).length).toBeGreaterThan(0);
  await expect.poll(async()=> (await get(request,'/api/notifications',admin)).filter((n:any)=>n.type==='PAYMENT_PROCESSED' && n.reference===String(paymentId)).length).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('failed transfers leave balances unchanged and appear as FAILED',async({page,request})=>{
  const john=await token(request,'user1');const source=(await get(request,'/api/accounts/my-accounts',john))[0];
  const headers={Authorization:`Bearer ${john}`};
  const invalid=await request.post(gateway+'/api/payments',{headers,data:{sourceAccountNumber:source.accountNumber,destinationAccountNumber:'999999999999',amount:-1,description:'Invalid'}});
  expect(invalid.status()).toBe(400);
  const description=`Missing destination ${Date.now()}`;
  const response=await request.post(gateway+'/api/payments',{headers,data:{sourceAccountNumber:source.accountNumber,destinationAccountNumber:'999999999999',amount:10,description}});
  expect(response.status()).toBe(202);const created=await response.json();
  await expect.poll(async()=> (await get(request,'/api/payments/my-payments',john)).find((p:any)=>p.id===created.id)?.status).toBe('FAILED');
  expect((await get(request,'/api/accounts/my-accounts',john))[0].balance).toBe(source.balance);
  await login(page);await page.getByRole('link',{name:'Payments',exact:true}).click();
  await expect(page.getByRole('row').filter({hasText:description})).toContainText('FAILED');
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'artifacts/choreographed/failed-payment.png',fullPage:true});
});

test('admin renders choreography audit trail and live customer data',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await login(page,'baas-admin','admin123');await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('button',{name:'Audit trail',exact:true}).click();
  await expect(page.getByRole('table')).toContainText('ACCOUNT_BALANCE_UPDATED');
  await page.screenshot({path:'artifacts/choreographed/audit-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Customers',exact:true}).click();await expect(page.getByRole('table')).toContainText('user1');
  await page.getByRole('button',{name:'Notifications',exact:true}).click();await expect(page.getByText('PAYMENT_PROCESSED',{exact:true}).first()).toBeVisible();
  expect(errors).toEqual([]);
});
