import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  useProductsWithMaterials,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  ProductWithMaterials,
} from "@/hooks/useProducts";
import { useRawMaterials } from "@/hooks/useRawMaterials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  X,
  Save,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { toast } from "sonner";

interface RecipeItem {
  rawMaterialId: string;
  name: string;
  quantity: number;
  active?: boolean;
}

export default function Products() {
  const { data: products, isLoading } = useProductsWithMaterials();
  const { data: rawMaterials } = useRawMaterials();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithMaterials | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", value: "" });
  const [tempRecipe, setTempRecipe] = useState<RecipeItem[]>([]);
  const [originalState, setOriginalState] = useState<string>("");
  const [selectedMaterialId, setSelectedMaterialId] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState("");

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({ name: "", code: "", value: "" });
    setTempRecipe([]);
    setOriginalState(
      JSON.stringify({ name: "", code: "", value: "", recipe: [] }),
    );
    setDialogOpen(true);
  };

  const openEditDialog = (product: ProductWithMaterials) => {
    setEditingProduct(product);

    const initialForm = {
      name: product.name,
      code: product.code,
      value: String(product.value),
    };
    setFormData(initialForm);

    const initialRecipe: RecipeItem[] = product.product_materials.map((pm) => ({
      rawMaterialId: String(pm.raw_material_id),
      name: pm.raw_materials?.name || "Desconhecido",
      quantity: pm.quantity_required,
      active: pm.raw_materials?.active ?? true,
    }));
    setTempRecipe(initialRecipe);

    const stateSnapshot = {
      ...initialForm,
      recipe: initialRecipe,
    };
    setOriginalState(JSON.stringify(stateSnapshot));

    setDialogOpen(true);
  };

  const hasChanges = useMemo(() => {
    const currentState = {
      ...formData,
      recipe: tempRecipe,
    };
    return JSON.stringify(currentState) !== originalState;
  }, [formData, tempRecipe, originalState]);

  const handleAddMaterialLocal = () => {
    if (!selectedMaterialId || !materialQuantity) return;

    const materialName =
      rawMaterials?.find((r) => String(r.id) === String(selectedMaterialId))
        ?.name || "Item";

    const newItem: RecipeItem = {
      rawMaterialId: selectedMaterialId,
      quantity: parseFloat(materialQuantity),
      name: materialName,
      active: true,
    };

    setTempRecipe([...tempRecipe, newItem]);
    setSelectedMaterialId("");
    setMaterialQuantity("");
  };

  const handleUpdateQuantityLocal = (index: number, newQty: number) => {
    if (newQty <= 0) return;
    const updated = [...tempRecipe];
    updated[index].quantity = newQty;
    setTempRecipe(updated);
  };

  const handleRemoveMaterialLocal = (index: number) => {
    const updated = [...tempRecipe];
    updated.splice(index, 1);
    setTempRecipe(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      value: parseFloat(formData.value),
      materials: tempRecipe.map((item) => ({
        rawMaterialId: Number(item.rawMaterialId),
        quantity: item.quantity,
      })),
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          data: payload,
        });
        toast.success("Produto e receita salvos com sucesso!");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Produto criado com sucesso!");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar. Verifique o console.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteProduct.mutateAsync(id);
      toast.success("Produto excluído.");
    }
  };

  const availableMaterials = rawMaterials?.filter(
    (m) => !tempRecipe.some((item) => item.rawMaterialId === String(m.id)),
  );

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie seus produtos e receitas.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="gap-2 bg-chart-2 hover:bg-chart-2/70"
          >
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        </div>

        <Card className="shadow-industrial">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-chart-2" /> Lista de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const isProductBroken = product.product_materials.some(
                        (pm) => pm.raw_materials?.active === false,
                      );

                      return (
                        <TableRow
                          key={product.id}
                          className={
                            isProductBroken
                              ? "bg-red-50 hover:bg-red-100/50"
                              : ""
                          }
                        >
                          <TableCell className="font-mono text-xs font-bold text-slate-500">
                            {product.code}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <span
                                className={`font-medium ${isProductBroken ? "text-red-900" : ""}`}
                              >
                                {product.name}
                              </span>
                              {isProductBroken && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wider mt-1">
                                  <Ban className="w-3 h-3" /> Produção
                                  Comprometida
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell
                            className={`font-mono font-bold ${
                              isProductBroken
                                ? "text-slate-400 decoration-slate-400 line-through"
                                : "text-green-600"
                            }`}
                          >
                            R${Number(product.value).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {product.product_materials.length > 0 ? (
                                product.product_materials.map((pm, idx) => {
                                  const isInactive =
                                    pm.raw_materials?.active === false;
                                  return (
                                    <Badge
                                      key={pm.id || idx}
                                      variant="secondary"
                                      className={`text-xs border-slate-200 ${
                                        isInactive
                                          ? "bg-red-200 text-red-900 border-red-300 line-through"
                                          : ""
                                      }`}
                                    >
                                      {pm.raw_materials?.name} (
                                      {pm.quantity_required})
                                    </Badge>
                                  );
                                })
                              ) : (
                                <span className="text-muted-foreground text-xs italic">
                                  Sem receita
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(product)}
                              >
                                <Pencil className="h-4 w-4 text-slate-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                Nenhum produto cadastrado.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Produto" : "Criar Novo Produto"}
              </DialogTitle>
              <DialogDescription>
                Altere os dados e a receita. As mudanças só serão salvas ao
                clicar em Salvar.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3 bg-slate-50 p-4 rounded-lg border">
                <div className="space-y-2 col-span-1">
                  <Label>Código</Label>
                  <Input
                    placeholder="Ex: BOL-001"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label>Nome</Label>
                  <Input
                    placeholder="Ex: Bolo de Chocolate"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2 col-span-1">
                  <Label>Valor (R$)</Label>
                  <Input
                    placeholder="Ex: 15.99"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-chart-2 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Ficha Técnica
                  </h4>

                  {hasChanges && editingProduct && (
                    <Badge className="bg-amber-500">
                      Alterações não salvas
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {tempRecipe.length > 0 ? (
                    tempRecipe.map((item, index) => {
                      const isDeleted = item.active === false;

                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between rounded-md border p-2 text-sm ${
                            isDeleted
                              ? "bg-red-50 border-red-200"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`font-medium ${
                                isDeleted ? "text-red-700" : "text-slate-700"
                              }`}
                            >
                              {item.name}
                            </span>
                            {isDeleted && (
                              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                <AlertTriangle className="w-3 h-3" /> Item
                                Descontinuado
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              className="w-20 h-8 bg-transparent"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuantityLocal(
                                  index,
                                  parseFloat(e.target.value),
                                )
                              }
                            />
                            <span className="text-xs text-slate-400">un</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:bg-red-100"
                              onClick={() => handleRemoveMaterialLocal(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-sm text-slate-400 italic py-2">
                      Nenhum ingrediente adicionado.
                    </p>
                  )}
                </div>

                <div className="flex gap-2 items-end bg-slate-100 p-3 rounded-md">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Matéria-Prima</Label>
                    <Select
                      value={selectedMaterialId}
                      onValueChange={setSelectedMaterialId}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMaterials?.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name} (Estoque: {m.stockQuantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Qtd</Label>
                    <Input
                      type="number"
                      className="bg-white"
                      value={materialQuantity}
                      onChange={(e) => setMaterialQuantity(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddMaterialLocal}
                    disabled={!selectedMaterialId || !materialQuantity}
                    className="bg-chart-2 hover:bg-chart-2/70"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || (!hasChanges && !!editingProduct)}
                  className={`gap-2 bg-chart-2 hover:bg-chart-2/70 ${
                    !hasChanges && editingProduct
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? "Salvar Alterações" : "Criar Produto"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
