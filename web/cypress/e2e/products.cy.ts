describe("Gestão de Produtos", () => {
  const rawMaterialName = "Material para Receita";

  before(() => {
    cy.request("POST", "http://localhost:8080/raw-materials", {
      name: rawMaterialName,
      code: "MAT-CY-REC",
      stockQuantity: 100,
    });
  });

  beforeEach(() => {
    cy.visit("/products");
  });

  it("Deve criar um produto com receita completa", () => {
    cy.contains("button", "Novo Produto").click();

    cy.get('input[placeholder="Ex: BOL-001"]').type("PROD-CY-02");
    cy.get('input[placeholder="Ex: Bolo de Chocolate"]').type(
      "Produto Cypress Final",
    );
    cy.get('input[placeholder="Ex: 15.99"]').type("50.00");
    cy.get('button[role="combobox"]').click();
    cy.get('[role="option"]').contains(rawMaterialName).click();
    cy.get('div.bg-slate-100 input[type="number"]').type("5");
    cy.get("div.bg-slate-100 button").last().click();
    cy.contains(rawMaterialName).should("be.visible");
    cy.contains("button", "Criar Produto").click();
    cy.contains("Produto criado com sucesso!").should("be.visible");
    cy.contains("tr", "Produto Cypress Final").within(() => {
      cy.contains("PROD-CY-02").should("be.visible");
      cy.contains("R$50.00").should("be.visible");
    });
  });
});
