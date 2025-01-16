describe('Example Test', () => {
    it('Visits the Cypress Website', () => {
      cy.visit('https://www.cypress.io');
      cy.contains('Cypress').should('be.visible');
    });
  });

  