describe('Testing', () => {
  it('Check', () => {
    cy.visit('/');
    cy.get('[name=foods]').type('Beef{downarrow}{enter}');
    cy.get('[name=foods]').should('have.value', 'Beef');
  });
});
