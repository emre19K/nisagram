describe('Complete User Flow', () => {
    const password = 'securePassword123';
    let email, userId;

    before(() => {
        cy.getRandomEmail().then(fetchedEmail => {
            email = fetchedEmail;
            cy.getRandomUserId().then(fetchedUserId => {
                userId = fetchedUserId;
            });
        });
    });

    it('should register a new user, verify email, log in, and create a post', () => {
        // Register
        cy.visit('/accounts/register');
        cy.get('input').eq(0).type(email);
        cy.get('input').eq(1).type('TestNick');
        cy.get('input').eq(2).type(userId);
        cy.get('input[type="password"]').type(password);
        cy.get('button').contains('Account erstellen').click();
        cy.url().should('include', '/accounts/login');

        // Verify Email
        cy.mailiskSearchInbox(Cypress.env("MAILISK_NAMESPACE"), {
            to_addr_prefix: email.split('@')[0],
            subject_includes: "verifikation",
            timeout: 1000 * 60,
        }).then(response => {
            const emails = response.data;
            const emailData = emails[0];
            const tokenMatch = emailData.html.match(/token=([a-zA-Z0-9._-]+)/);
            const token = tokenMatch ? tokenMatch[1] : null;
            expect(token).to.not.be.null;
            cy.log(`Extracted token: ${token}`);

            const verificationLink = `/user/verify?token=${token}`;
            cy.log(`Verification link: ${verificationLink}`);

            cy.visit(verificationLink);
            cy.contains('Verifizierung erfolgreich!').should('be.visible');
        });

        // Log in
        cy.visit('/accounts/login');
        cy.get('input').eq(0).type(userId);
        cy.get('input[type="password"]').type(password);
        cy.contains('Einloggen').click();
        cy.url().should('eq', `${Cypress.config('baseUrl')}/`);

        // Navigate to post creation page
        cy.contains('Erstellen').click();
        cy.url().should('include', '/posts/create');
        cy.get('h1').contains('Beitrag erstellen').should('be.visible');

        // Upload the file
        const filePath = 'testImage.png'; // Adjust the path to your test image
        cy.get('input[type="file"]').attachFile(filePath);

        // Type the description
        cy.get('input').eq(0).type('This is a test post description.');

        // Click the submit button
        cy.get('button').contains('Beitrag erstellen').click();

        // Verify the post was successfully created
        // Assuming the app redirects to profile page after post creation
        cy.url().should('include', '/profile');

        // Verify the new post appears on the profile page
        cy.contains('This is a test post description').should('be.visible');
    });
});
