import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductionSimulator from "./ProductionSimulator";
import productsReducer from "@/store/slices/productsSlice";
import materialsReducer from "@/store/slices/materialsSlice";
import * as hooks from "@/hooks/useProducts";

vi.mock("@/hooks/useProducts", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useProductsWithMaterials: vi.fn(),
  };
});

const renderWithRedux = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const store = configureStore({
    reducer: { products: productsReducer, materials: materialsReducer },
  });

  return {
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>{component}</BrowserRouter>
        </QueryClientProvider>
      </Provider>,
    ),
  };
};

describe("ProductionSimulator", () => {
  it("Deve calcular a quantidade máxima baseada no estoque e priorizar valor", () => {
    vi.mocked(hooks.useProductsWithMaterials).mockReturnValue({
      isLoading: false,
      data: [
        {
          id: "1",
          name: "Produto Caro",
          code: "P1",
          value: 100.0,
          product_materials: [
            {
              quantity_required: 2,
              raw_material_id: "1",
              raw_materials: {
                id: "1",
                name: "Ouro",
                stock_quantity: 10,
                active: true,
              },
            },
          ],
        },
      ],
    } as any);

    renderWithRedux(<ProductionSimulator />);

    expect(screen.getByText("Produto Caro")).toBeInTheDocument();

    const elements = screen.getAllByText("5");
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("Deve exibir mensagem quando não há estoque suficiente", () => {
    vi.mocked(hooks.useProductsWithMaterials).mockReturnValue({
      isLoading: false,
      data: [],
    } as any);

    renderWithRedux(<ProductionSimulator />);

    expect(
      screen.getByText("Nenhuma sugestão de produção disponível"),
    ).toBeInTheDocument();
  });

  it("Deve mostrar estado de carregamento (Skeleton)", () => {
    vi.mocked(hooks.useProductsWithMaterials).mockReturnValue({
      isLoading: true,
      data: undefined,
    } as any);

    const { container } = renderWithRedux(<ProductionSimulator />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });
});
