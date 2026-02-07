import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useAddProductMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      product_id: string;
      raw_material_id: string;
      quantity_required: number;
    }) => {
      const payload = {
        rawMaterialId: Number(data.raw_material_id),
        quantity: data.quantity_required,
      };

      return await api.post(`/products/${data.product_id}/materials`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-full"] });
    },
  });
};

export const useUpdateProductMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      quantity_required,
    }: {
      id: string;
      quantity_required: number;
    }) => {
      return await api.put(`/products/materials/${id}`, {
        quantity: quantity_required,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-full"] });
    },
  });
};

export const useRemoveProductMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/products/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-full"] });
    },
  });
};
