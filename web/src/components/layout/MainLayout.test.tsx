import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MainLayout } from "./MainLayout";
import { BrowserRouter } from "react-router-dom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe("MainLayout Component", () => {
  it("Deve renderizar a Sidebar com o nome do sistema", () => {
    render(
      <BrowserRouter>
        <MainLayout>
          <div>Conteúdo Teste</div>
        </MainLayout>
      </BrowserRouter>,
    );

    const titulos = screen.getAllByText("StockMaster");
    expect(titulos.length).toBeGreaterThan(0);

    const subtitulos = screen.getAllByText("Industrial Control");
    expect(subtitulos.length).toBeGreaterThan(0);
  });

  it("Deve renderizar os links de navegação principais", () => {
    render(
      <BrowserRouter>
        <MainLayout>
          <div>Conteúdo Teste</div>
        </MainLayout>
      </BrowserRouter>,
    );

    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Produtos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Estoque de Insumos").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Simulador de Produção").length).toBeGreaterThan(
      0,
    );
  });

  it("Deve renderizar o conteúdo filho (children) corretamente", () => {
    render(
      <BrowserRouter>
        <MainLayout>
          <h1 data-testid="child-content">Conteúdo Exclusivo da Página</h1>
        </MainLayout>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(
      screen.getByText("Conteúdo Exclusivo da Página"),
    ).toBeInTheDocument();
  });
});
