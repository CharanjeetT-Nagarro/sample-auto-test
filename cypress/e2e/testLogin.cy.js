describe('Google Account Automation', () => {
    const testURL = 'https://practicetestautomation.com/practice-test-login/';
    const validEmail =  Cypress.env('email'); 
    const validPassword = Cypress.env('password');

    it('Should open Practice Test Automation login page', () => {
      cy.visit(testURL);
      cy.url().should('include', 'practice-test-login');
      cy.title().should('include', 'Test Login | Practice Test Automation');
    });
  
    it('Should login with valid credentials', () => {
        cy.visit(testURL);
        cy.get('#username').type(validEmail);
        //   cy.contains('Next').click();
        cy.get('#password').type(validPassword, { log: false }); // Hides password in logs
        cy.get('#submit').click();
        cy.url().should('not.include', 'practice-test-login');
        cy.title().should('include', 'Logged In Successfully');
    });
  
    it('Should logout successfully', () => {
        cy.visit(testURL);
        cy.get('#username').type(validEmail);
        cy.get('#password').type(validPassword, { log: false }); // Hides password in logs
        cy.get('#submit').click();
        cy.get(`div.wp-block-group>div>div>a`).contains("Log out").click();
        cy.url().should('include', 'practice-test-login');
    });
  
    it('Should fail login with incorrect password', () => {
        cy.visit(testURL);
        cy.get('#username').type(validEmail);
        cy.get('#password').type('wrongpassword');
        cy.get('#submit').click();
        cy.get('#error').contains('Your password is invalid!').should('be.visible');
    });
  
    it('Should fail login with incorrect username', () => {
        cy.visit(testURL);
        cy.get('#username').type("invalidEmail");
        cy.get('#password').type(validPassword, { log: false }); // Hides password in logs
        cy.get('#submit').click();
        cy.get('#error').contains('Your username is invalid!').should('be.visible');
    });
  });
  