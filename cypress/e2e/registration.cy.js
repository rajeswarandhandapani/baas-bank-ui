// e2e test for login flow with Keycloak

const users = [
  { username: 'user1', password: 'user123' },
  { username: 'user2', password: 'user123' },
  { username: 'baas-admin', password: 'admin123' },
];

describe('User Registration Flow', () => {
  users.forEach(({ username, password }) => {
    it(`should register and login via Keycloak as ${username}`, () => {
      // Visit the welcome page
      cy.visit('http://localhost:4200/');

      // Click the Create Account button
      cy.contains('button', 'Create Account').click();

      // On Keycloak login page (update domain as needed)
      cy.origin('http://localhost:8089/', { args: { username, password } }, ({ username, password }) => {
        cy.get('input#username').type(username);
        cy.get('input#password').type(password);
        cy.get('input[type="submit"], button[type="submit"]').click();
      });

      // Optionally, assert successful login or redirection
      cy.contains('Dashboard');

      // Click the logout button (update selector as needed)
      cy.contains('button, a', 'Logout').click();

      // Optionally, assert redirection to login or welcome page
      // cy.url().should('include', '/login');
      // cy.contains('Login');
    });
  });
});
