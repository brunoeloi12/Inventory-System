import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface SimpleProduct {
  id: string;
  name: string;
  value: number;
}

export interface ProductWithMaterials {
  id: string;
  name: string;
  code: string;
  value: number;
  product_materials: {
    id: string;
    quantity_required: number;
    raw_material_id: string;
    raw_materials: {
      id: string;
      name: string;
      stock_quantity: number;
      active: boolean;
    };
  }[];
}

export interface ProductPayloadDTO {
  name: string;
  code: string;
  value: number;
  materials: { rawMaterialId: number; quantity: number }[];
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<SimpleProduct[]>("/products");
      return data;
    },
  });
};

export const useProductsWithMaterials = () => {
  return useQuery({
    queryKey: ["products-full"],
    queryFn: async () => {
      const { data } = await api.get<any[]>("/products");

      return data.map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        value: p.value,
        product_materials: (p.materials || p.composition || []).map(
          (m: any) => ({
            id: m.id,
            quantity_required: m.quantityRequired || m.quantity,
            raw_material_id: m.rawMaterial?.id,
            raw_materials: {
              id: m.rawMaterial?.id,
              name: m.rawMaterial?.name,
              stock_quantity: m.rawMaterial?.stockQuantity,
            },
          }),
        ),
      })) as ProductWithMaterials[];
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProductPayloadDTO) => {
      return await api.post("/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-full"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ProductPayloadDTO;
    }) => {
      return await api.put(`/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-full"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-full"] });
    },
  });
};
