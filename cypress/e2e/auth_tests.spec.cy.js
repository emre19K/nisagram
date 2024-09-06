describe('Authentication Flow', () => {

    let randomEmail, randomUserId; // Define variables to store dynamic values

    before(() => {
        // Generate random user info before test using custom Cypress commands
        cy.getRandomEmail().then(email => {
            randomEmail = email; // Assign the email to the variable
        });
        cy.getRandomUserId().then(userId => {
            randomUserId = userId; // Assign the userId to the variable
        });
    });

    it('should navigate to the registration page', () => {
        cy.visit('/');
        cy.contains('Kein Account? Jetzt einen erstellen.').click();
        cy.url().should('include', '/accounts/register');
    });

    it('should register a new user with random data', () => {
        cy.visit('/accounts/register');
        cy.get('input').eq(0).type(randomEmail); // Use the random email stored from beforeEach
        cy.get('input').eq(1).type('TestNick'); // Second input for nickname
        cy.get('input').eq(2).type(randomUserId); // Use the random user ID stored from beforeEach
        cy.get('input[type="password"]').type('securePassword123'); // Password input
        cy.get('button').contains('Account erstellen').click();
        cy.url().should('include', '/login'); // Redirection to login after registration
    });

    it('should log in a registered user, then log him out again', () => {
        const password = 'securePassword123';

        cy.visit('/accounts/login');
        cy.get('input').eq(0).type(randomUserId); // Use the random user ID stored from beforeEach
        cy.get('input[type="password"]').type(password);
        cy.contains('Einloggen').click();
        cy.url().should('include', '/'); // Assuming redirection to home after login
        cy.get('h1').contains('Willkommen!').should('be.visible'); // Confirm that the homepage is reached
        cy.get('button').contains('Logout').should('be.visible').click(); // Confirm logout is possible
        cy.get('h1').contains('Login').should('be.visible');
    });
});
