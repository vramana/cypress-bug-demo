describe('Testing', () => {
  it('Check', () => {
    cy.visit('/');

    cy.get('[name=foods]').type('Beef');
    cy.contains('[role=option]', 'Beef').click();

    cy.get('[name=foods]').should('have.value', 'Beef');
  });
});
