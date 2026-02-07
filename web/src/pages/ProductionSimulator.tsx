import { useMemo } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { useProductsWithMaterials } from "../hooks/useProducts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Factory, TrendingUp, Package, AlertTriangle } from "lucide-react";

interface ProductionSuggestion {
  productId: string;
  productName: string;
  productValue: number;
  maxQuantity: number;
  totalValue: number;
  materialsUsed: { name: string; required: number; available: number }[];
}

export default function ProductionSimulator() {
  const { data: products, isLoading } = useProductsWithMaterials();

  const productionSuggestions = useMemo(() => {
    if (!products) return { suggestions: [], totalValue: 0 };

    const stockTracker: Record<string, number> = {};
    products.forEach((p) => {
      p.product_materials.forEach((pm) => {
        if (!stockTracker[pm.raw_material_id]) {
          stockTracker[pm.raw_material_id] = pm.raw_materials.stock_quantity;
        }
      });
    });

    const sortedProducts = [...products]
      .filter((p) => p.product_materials.length > 0)
      .sort((a, b) => Number(b.value) - Number(a.value));

    const suggestions: ProductionSuggestion[] = [];

    for (const product of sortedProducts) {
      let maxQuantity = Infinity;

      const materialsInfo = product.product_materials.map((pm) => {
        const available = stockTracker[pm.raw_material_id] || 0;
        const canProduce = Math.floor(available / pm.quantity_required);
        maxQuantity = Math.min(maxQuantity, canProduce);

        return {
          name: pm.raw_materials.name,
          required: pm.quantity_required,
          available: available,
        };
      });

      if (maxQuantity > 0 && maxQuantity !== Infinity) {
        product.product_materials.forEach((pm) => {
          stockTracker[pm.raw_material_id] -=
            pm.quantity_required * maxQuantity;
        });

        suggestions.push({
          productId: product.id,
          productName: product.name,
          productValue: Number(product.value),
          maxQuantity,
          totalValue: maxQuantity * Number(product.value),
          materialsUsed: materialsInfo,
        });
      }
    }

    const totalValue = suggestions.reduce((sum, s) => sum + s.totalValue, 0);

    return { suggestions, totalValue };
  }, [products]);

  const { suggestions, totalValue } = productionSuggestions;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Simulador de Produção
          </h1>
          <p className="text-muted-foreground">
            Sugestões de produção otimizadas com base nas matérias-primas
            disponíveis.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-industrial">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tipos de produtos podem ser feitos
              </CardTitle>
              <Package className="h-6 w-6 text-chart-2" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">{suggestions.length}</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-industrial">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de unidades sugeridas
              </CardTitle>
              <Factory className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-3xl font-bold">
                  {suggestions.reduce((sum, s) => sum + s.maxQuantity, 0)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-industrial border-accent/50 bg-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita potencial
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                <div className="text-3xl font-bold text-chart-2">
                  R$
                  {totalValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-industrial">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-chart-2" />
              Sugestões de Produção
            </CardTitle>
            <CardDescription>
              Produtos são priorizados pelo valor mais alto primeiro. Os
              materiais são alocados de forma otimizada para maximizar a
              receita.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="table-header-bg">
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Valor Unitário</TableHead>
                      <TableHead>Quantidade Sugerida</TableHead>
                      <TableHead>Materiais Usados</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.map((suggestion, index) => (
                      <TableRow key={suggestion.productId}>
                        <TableCell>
                          <Badge
                            variant={index === 0 ? "default" : "secondary"}
                            className={
                              index === 0
                                ? "bg-accent text-accent-foreground"
                                : ""
                            }
                          >
                            #{index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {suggestion.productName}
                        </TableCell>
                        <TableCell className="font-mono">
                          R${suggestion.productValue.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {suggestion.maxQuantity}
                          </span>{" "}
                          units
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.materialsUsed.map((m) => (
                              <Badge
                                key={m.name}
                                variant="outline"
                                className="text-xs"
                              >
                                {m.name}: {m.required * suggestion.maxQuantity}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold text-success">
                          R$
                          {suggestion.totalValue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
                <h3 className="mt-4 text-lg font-semibold">
                  Nenhuma sugestão de produção disponível
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {products?.length === 0
                    ? "Nenhum produto cadastrado. Adicione os produtos e seus requisitos de materiais primeiro.."
                    : products?.every((p) => p.product_materials.length === 0)
                      ? "Os produtos precisam de matérias-primas alocadas para calcular as possibilidades de produção."
                      : "Estoque insuficiente de matérias-primas para produzir qualquer produto."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="rounded-lg border border-muted bg-muted/30 p-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Como funciona
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            O sistema calcula a produção ideal, priorizando os produtos com
            maior valor. Assim que um produto é programado, os materiais
            necessários são deduzidos do estoque disponível antes do cálculo do
            próximo produto, garantindo um planejamento de produção realista.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
