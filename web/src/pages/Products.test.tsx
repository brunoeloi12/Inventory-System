import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Products from "./Products";
import productsReducer from "@/store/slices/productsSlice";
import materialsReducer from "@/store/slices/materialsSlice";
import * as hooks from "@/hooks/useProducts";
import * as matHooks from "@/hooks/useRawMaterials";

vi.mock("@/hooks/useProducts", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, useProductsWithMaterials: vi.fn() };
});
vi.mock("@/hooks/useRawMaterials", () => ({ useRawMaterials: vi.fn() }));

const renderWithRedux = (component: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      products: productsReducer,
      materials: materialsReducer,
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{component}</BrowserRouter>
      </QueryClientProvider>
    </Provider>,
  );
};

vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Página de Produtos", () => {
  it("Deve identificar visualmente produtos com produção comprometida", () => {
    vi.mocked(hooks.useProductsWithMaterials).mockReturnValue({
      data: [
        {
          id: "1",
          name: "Bolo Normal",
          code: "BOL-01",
          value: 20.0,
          product_materials: [
            {
              id: "pm1",
              quantity_required: 2,
              raw_material_id: "1",
              raw_materials: {
                id: "1",
                name: "Farinha",
                active: true,
                stock_quantity: 100,
              },
            },
          ],
        },
        {
          id: "2",
          name: "Bolo Cancelado",
          code: "BOL-99",
          value: 50.0,
          product_materials: [
            {
              id: "pm2",
              quantity_required: 5,
              raw_material_id: "2",
              raw_materials: {
                id: "2",
                name: "Ovo Extinto",
                active: false,
                stock_quantity: 0,
              },
            },
          ],
        },
      ],
      isLoading: false,
    } as any);

    vi.mocked(matHooks.useRawMaterials).mockReturnValue({ data: [] } as any);

    renderWithRedux(<Products />);

    expect(screen.getByText("Bolo Normal")).toBeInTheDocument();
    expect(screen.getByText("Bolo Cancelado")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Produção Comprometida/i).length,
    ).toBeGreaterThan(0);
  });
});
