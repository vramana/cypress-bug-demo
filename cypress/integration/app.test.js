describe("Testing", () => {
  it("Check", () => {
    cy.visit("/");
    cy.get("[name=foods]")
      .click()
      .type("Beef");
    cy.get("[data-test-id=autoCompleteMenu]")
      .contains("Beef")
      .click();
    cy.get("[data-test-id=autoCompleteMenu]").should("not.exist");
    cy.get("[name=foods]").contains("Beef");
  });
});
