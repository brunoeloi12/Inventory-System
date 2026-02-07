import React, { useState } from "react";
import { NavLink } from "../NavLink";
import { LayoutDashboard, Package, Boxes, Factory, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-foreground text-secondary">
      <div className="p-6 border-b border-border/15">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <div className="w-9 h-9 bg-chart-2 rounded-lg flex items-center justify-center">
            <Factory className="w-6 h-6 text-primary-foreground" />
          </div>
          StockMaster
        </h1>
        <p className="text-xs text-ring mt-1">Industrial Control</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/"
          onClick={handleMobileLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-secondary hover:bg-popover/20 hover:text-secondary transition-colors"
          activeClassName="bg-chart-2 text-primary hover:bg-chart-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>

        <NavLink
          to="/products"
          onClick={handleMobileLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-secondary hover:bg-popover/20 hover:text-secondary transition-colors"
          activeClassName="bg-chart-2 text-primary hover:bg-chart-2"
        >
          <Package className="w-4 h-4" />
          Produtos
        </NavLink>

        <NavLink
          to="/raw-materials"
          onClick={handleMobileLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-secondary hover:bg-popover/20 hover:text-secondary transition-colors"
          activeClassName="bg-chart-2 text-primary hover:bg-chart-2"
        >
          <Boxes className="w-4 h-4" />
          Estoque de Insumos
        </NavLink>

        <NavLink
          to="/production"
          onClick={handleMobileLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-secondary hover:bg-popover/20 hover:text-secondary transition-colors"
          activeClassName="bg-chart-2 text-primary hover:bg-chart-2"
        >
          <Factory className="w-4 h-4" />
          Simulador de Produção
        </NavLink>
      </nav>

      <div className="border-t border-ring/20 p-4">
        <p className="text-xs text-sidebar-ring/50">
          © 2024 Industrial Stock Control
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 bg-foreground border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-chart-2 rounded-lg flex items-center justify-center">
            <Factory className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-secondary">StockMaster</span>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-secondary hover:bg-chart-2/80"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 border-r border-ring/20 text-white bg-foreground w-72"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Menu de Navegação</SheetTitle>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:flex w-64 bg-foreground border-r border-border min-h-screen flex-col">
        <SidebarContent />
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto bg-slate-50/50 h-[calc(100vh-65px)] md:h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
