// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js
import 'cypress-file-upload';


Cypress.Commands.add('getRandomEmail', () => {
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `test+${randomPart}@${Cypress.env("MAILISK_NAMESPACE")}.mailisk.net`; //hier wird MAILISK benutzt um eine quasi "echte" email zu generieren
});

Cypress.Commands.add('getRandomUserId', () => {
    return Math.random().toString(36).substring(2, 15);
});


Cypress.Commands.add('registerUser', (email, userId, password) => {
    cy.visit('/accounts/register');
    cy.get('input').eq(0).type(email);
    cy.get('input').eq(1).type('TestNick');
    cy.get('input').eq(2).type(userId);
    cy.get('input[type="password"]').type(password);
    cy.get('button').contains('Account erstellen').click();
    cy.url().should('include', '/login');
});

Cypress.Commands.add('loginUser', (userId, password) => {
    cy.visit('/accounts/login');
    cy.get('input').eq(0).type(userId);
    cy.get('input[type="password"]').type(password);
    cy.contains('Einloggen').click();
    cy.url().should('include', '/');
    cy.get('h1').contains('Willkommen!').should('be.visible');
});
