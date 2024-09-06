describe('Authentication Flow with Email Verification', () => {
    let randomEmail, randomUserId, password = 'securePassword123';

    // Generate random email and user ID before starting the tests
    before(() => {
        cy.getRandomEmail().then(email => {
            randomEmail = email; 
        });
        cy.getRandomUserId().then(userId => {
            randomUserId = userId; 
        });
    });

    // Test to navigate to the registration page
    it('should navigate to the registration page', () => {
        cy.visit('/'); // Visit the homepage
        cy.contains('Kein Account? Jetzt einen erstellen.').click(); 
        cy.url().should('include', '/accounts/register'); // Verify the URL includes /accounts/register
    });

    // Test to register a new user with random data
    it('should register a new user with random data', () => {
        cy.visit('/accounts/register'); 
        cy.get('input').eq(0).type(randomEmail); 
        cy.get('input').eq(1).type('TestNick');
        cy.get('input').eq(2).type(randomUserId);
        cy.get('input[type="password"]').type(password);
        cy.get('button').contains('Account Erstellen').click();
        cy.url().should('include', '/accounts/login'); // Verify the URL includes /login (redirects to login page after registration)
    });

    // Test to verify the email using Mailisk
    it('should verify the email', () => {
        // Search the Mailisk inbox for the verification email
        cy.mailiskSearchInbox(Cypress.env("MAILISK_NAMESPACE"), {
            to_addr_prefix: randomEmail.split('@')[0], // Use the prefix of the random email to filter
            subject_includes: "verifikation", // Look for emails with "verifikation" in the subject
            timeout: 1000 * 60, // Set timeout for 60 seconds
        }).then((response) => {
            const emails = response.data; // Get the emails from the response
            const email = emails[0]; // Assume the first email is the correct one
            const tokenMatch = email.html.match(/token=([a-zA-Z0-9._-]+)/); // Extract the token from the email HTML
            const token = tokenMatch ? tokenMatch[1] : null; // Get the first match group which should be the token
            expect(token).to.not.be.null; // Ensure the token is not null
            cy.log(`Extracted token: ${token}`); // Log the extracted token

            const verificationLink = `/user/verify?token=${token}`; // Construct the verification link
            cy.log(`Verification link: ${verificationLink}`); // Log the verification link for debugging

            cy.intercept('GET', `/auth/verify?token=${token}`).as('verificationRequest'); // Set up interception before visiting the link
            cy.visit(verificationLink); // Visit the verification link

            cy.wait('@verificationRequest').then((interception) => {
                expect(interception.response.statusCode).to.eq(200); // Ensure the response status code is 200 (OK)
                cy.log('Email verification response:', interception.response.body);
            });

            // Check if the verification was successful by checking for the success message or redirect
            cy.contains('Verifizierung erfolgreich!').should('be.visible'); // Adjust based on frontend implementation
        });
    });

    // Test to log in the user after verification
    it('should log in the user after verification', () => {
        cy.visit('/accounts/login'); 
        cy.get('input').eq(0).type(randomUserId);
        cy.get('input[type="password"]').type(password);

        // Intercept the login request to inspect the response
        cy.intercept('POST', '/auth/login').as('loginRequest');
        cy.contains('Einloggen').click();

        // Wait for the login request to complete and inspect the response
        cy.wait('@loginRequest').then((interception) => {
            cy.log('Login response:', interception.response.body);
            expect(interception.response.statusCode).to.eq(200); // Ensure the response status code is 200 (OK)
        });

        // Check if the URL is the base URL indicating successful login
        cy.url().should('eq', `${Cypress.config('baseUrl')}/`);

        // Check for the presence of the navbar links to confirm successful login
        cy.get('ul.nav-fixed').should('be.visible'); 

        // Perform logout to ensure the session is correctly terminated
        cy.contains('Logout').click(); 
        cy.get('h1').contains('Login').should('be.visible'); // Ensure the login page is visible after logout
    });
});
