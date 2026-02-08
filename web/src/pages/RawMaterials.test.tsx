import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RawMaterials from "./RawMaterials";
import materialsReducer from "@/store/slices/materialsSlice";

import * as hooks from "@/hooks/useRawMaterials";
vi.mock("@/hooks/useRawMaterials", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useRawMaterials: vi.fn(),
  };
});

const renderWithRedux = (component: React.ReactNode, initialState: any) => {
  const store = configureStore({
    reducer: combineReducers({
      materials: materialsReducer,
    }),
    preloadedState: initialState as any,
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

describe("Página de Insumos", () => {
  it("Deve exibir a lista de materiais corretamente", () => {
    vi.mocked(hooks.useRawMaterials).mockReturnValue({
      data: [
        { id: "1", name: "Farinha Teste", code: "FAR-99", stockQuantity: 50 },
        { id: "2", name: "Ovo", code: "OVO-01", stockQuantity: 0 },
      ],
      isLoading: false,
    } as any);

    renderWithRedux(<RawMaterials />, {});

    expect(screen.getByText("Farinha Teste")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("Esgotado")).toBeInTheDocument();
  });

  it("Deve abrir o modal ao clicar em Novo Insumo", () => {
    vi.mocked(hooks.useRawMaterials).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    renderWithRedux(<RawMaterials />, {});

    const botao = screen.getByText("Novo Insumo");
    fireEvent.click(botao);

    expect(screen.getByText("Adicionar Material")).toBeInTheDocument();
  });
});
