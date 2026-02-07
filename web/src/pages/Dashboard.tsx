import { MainLayout } from "../components/layout/MainLayout";
import { useProducts } from "../hooks/useProducts";
import { useRawMaterials } from "../hooks/useRawMaterials";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Package, Boxes, TrendingUp, AlertTriangle } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: rawMaterials, isLoading: materialsLoading } = useRawMaterials();

  const totalProductsValue =
    products?.reduce((sum, p) => sum + Number(p.value), 0) || 0;
  const lowStockMaterials =
    rawMaterials?.filter((m) => m.stockQuantity < 10) || [];

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu sistema de controle de estoque industrial
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-industrial">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Produtos Totais
              </CardTitle>
              <Package className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {products?.length || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-industrial">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Matérias-primas Totais
              </CardTitle>
              <Boxes className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              {materialsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {rawMaterials?.length || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-industrial">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor total dos produtos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold">
                  R$
                  {totalProductsValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-industrial">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alertas de estoque baixo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              {materialsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {lowStockMaterials.length}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-industrial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-chart-2" />
                Produtos recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="font-mono text-sm text-muted-foreground">
                        R${Number(product.value).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Ainda não há produtos cadastrados.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-industrial">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-chart-2" />
                Materiais com baixo estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              {materialsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : lowStockMaterials.length > 0 ? (
                <div className="space-y-3">
                  {lowStockMaterials.slice(0, 5).map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 p-3"
                    >
                      <span className="font-medium">{material.name}</span>
                      <span className="font-mono text-sm font-semibold text-warning">
                        {material.stockQuantity} units
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Todos os materiais têm estoque suficiente.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
