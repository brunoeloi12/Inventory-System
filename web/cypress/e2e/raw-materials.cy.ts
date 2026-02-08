describe("Gestão de Matérias-Primas", () => {
  beforeEach(() => {
    cy.visit("/raw-materials");
  });

  it("Deve criar um novo insumo com sucesso", () => {
    cy.contains("button", "Novo Insumo").click();

    cy.get('input[placeholder="Ex: FAR-001"]').type("TEST-E2E-01");
    cy.get('input[placeholder="Ex: Farinha de Trigo"]').type(
      "Insumo de Teste Cypress",
    );
    cy.get('input[placeholder="0"]').clear().type("500");

    cy.contains("button", "Salvar").click();

    cy.contains("Matéria-prima criada!").should("be.visible");

    cy.contains("tr", "Insumo de Teste Cypress").within(() => {
      cy.contains("TEST-E2E-01").should("be.visible");
      cy.contains("500").should("be.visible");
    });
  });
});
