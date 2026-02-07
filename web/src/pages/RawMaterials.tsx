import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  useRawMaterials,
  useCreateRawMaterial,
  useUpdateRawMaterial,
  useDeleteRawMaterial,
  RawMaterial,
} from "@/hooks/useRawMaterials";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Boxes,
  Archive,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RawMaterials() {
  const { data: materials, isLoading } = useRawMaterials();
  const createMaterial = useCreateRawMaterial();
  const updateMaterial = useUpdateRawMaterial();
  const deleteMaterial = useDeleteRawMaterial();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    stockQuantity: "",
  });

  const openCreateDialog = () => {
    setEditingMaterial(null);
    setFormData({ name: "", code: "", stockQuantity: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (material: RawMaterial) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      code: material.code,
      stockQuantity: String(material.stockQuantity),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      code: formData.code,
      stockQuantity: parseFloat(formData.stockQuantity),
    };

    try {
      if (editingMaterial) {
        await updateMaterial.mutateAsync({ id: editingMaterial.id, data });
        toast.success("Matéria-prima atualizada!");
      } else {
        await createMaterial.mutateAsync(data);
        toast.success("Matéria-prima criada!");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar dados.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      try {
        await deleteMaterial.mutateAsync(id);
        toast.success("Item excluído.");
      } catch (error: any) {
        if (error.response?.status === 409) {
          const usageCount = error.response?.data?.count || 1;

          if (usageCount > 1) {
            toast.error("Ação Bloqueada", {
              description:
                "Este material está sendo usado na receita de um ou mais produtos por isto não pode ser excluida.",
              duration: 5000,
              icon: <AlertCircle className="h-5 w-5 text-red-500" />,
              action: {
                label: "Entendi",
                onClick: () => console.log("Aviso fechado"),
              },
            });
          } else {
            toast.error(
              "Não é possível excluir pois o material esta sendo usado.",
              {
                description: "Este item está vinculado a uma receita única.",
                duration: 5000,
                icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                action: {
                  label: "Entendi",
                  onClick: () => console.log("Aviso fechado"),
                },
              },
            );
          }
        } else {
          toast.error("Erro ao excluir. Tente novamente.");
        }
      }
    }
  };

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Esgotado</Badge>;
    }
    if (quantity < 10) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Baixo</Badge>;
    }
    return <Badge className="bg-green-600 hover:bg-green-700">OK</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Estoque de Insumos
            </h1>
            <p className="text-muted-foreground">
              Gerencie as matérias-primas disponíveis (Code, Name, Stock).
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="gap-2 bg-chart-2 hover:bg-chart-2/70"
          >
            <Plus className="h-4 w-4" />
            Novo Insumo
          </Button>
        </div>

        <Card className="shadow-industrial border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Boxes className="h-5 w-5 text-chart-2" />
              Inventário Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : materials && materials.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow
                        key={material.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-mono text-xs font-bold text-slate-500">
                          {material.code}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700">
                          {material.name}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "font-mono font-bold",
                              material.stockQuantity < 10
                                ? "text-amber-600"
                                : "text-slate-600",
                              material.stockQuantity === 0 && "text-red-600",
                            )}
                          >
                            {material.stockQuantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStockBadge(material.stockQuantity)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => openEditDialog(material)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">
                  Estoque Vazio
                </h3>
                <p className="text-muted-foreground mb-6">
                  Nenhuma matéria-prima cadastrada.
                </p>
                <Button onClick={openCreateDialog} variant="outline">
                  Cadastrar Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-dialog">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? "Editar Material" : "Adicionar Material"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do insumo abaixo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Ex: FAR-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Farinha de Trigo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantidade Inicial</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  step="1"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: e.target.value })
                  }
                  placeholder="0"
                  required
                />
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
                  disabled={
                    createMaterial.isPending || updateMaterial.isPending
                  }
                  className="bg-chart-2 hover:bg-chart-2/70"
                >
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
