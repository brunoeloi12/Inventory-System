describe("Simulador de Produção", () => {
  it("Deve calcular e exibir sugestões baseadas nos dados de produtos e estoque", () => {
    cy.intercept("GET", "**/products", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Produto Teste Cypress",
          value: 100.0,
          composition: [
            {
              quantityRequired: 2,
              rawMaterial: {
                id: 1,
                name: "Material Rico",
                stockQuantity: 20,
              },
            },
          ],
        },
      ],
    }).as("getProducts");

    cy.visit("/production");

    cy.wait("@getProducts");

    cy.contains("Total de unidades sugeridas")
      .parents(".shadow-industrial")
      .find("div.text-3xl")
      .should("have.text", "10");

    cy.contains("Receita potencial")
      .parents(".shadow-industrial")
      .find("div.text-3xl")
      .should("contain", "1,000.00");

    cy.contains("table", "Produto Teste Cypress").within(() => {
      cy.contains("10 units").should("be.visible");
    });
  });
});
