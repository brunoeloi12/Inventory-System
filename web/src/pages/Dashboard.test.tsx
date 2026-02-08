import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "./Dashboard";
import { BrowserRouter } from "react-router-dom";
import * as productHooks from "@/hooks/useProducts";
import * as materialHooks from "@/hooks/useRawMaterials";

vi.mock("@/hooks/useProducts", () => ({ useProducts: vi.fn() }));
vi.mock("@/hooks/useRawMaterials", () => ({ useRawMaterials: vi.fn() }));
vi.mock("@/components/layout/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Dashboard", () => {
  it("Deve exibir totais e alertas corretamente com números distintos", () => {
    vi.mocked(productHooks.useProducts).mockReturnValue({
      data: [
        { id: "1", name: "Prod A", value: 100.0 },
        { id: "2", name: "Prod B", value: 50.5 },
      ],
      isLoading: false,
    } as any);

    vi.mocked(materialHooks.useRawMaterials).mockReturnValue({
      data: [
        { id: "1", name: "Aço", stockQuantity: 100 },
        { id: "2", name: "Ferro", stockQuantity: 50 },
        { id: "3", name: "Plástico", stockQuantity: 20 },
        { id: "4", name: "Chip", stockQuantity: 5 },
      ],
      isLoading: false,
    } as any);

    render(<Dashboard />, { wrapper: BrowserRouter });

    expect(screen.getByText(/^2$/)).toBeInTheDocument();

    expect(screen.getByText(/^4$/)).toBeInTheDocument();

    const cardAlertas = screen
      .getByText("Alertas de estoque baixo")
      .closest("div.rounded-lg");
    expect(cardAlertas).toHaveTextContent("1");

    expect(screen.getByText("Chip")).toBeInTheDocument();
    expect(screen.queryByText("Aço")).not.toBeInTheDocument();
  });
});
