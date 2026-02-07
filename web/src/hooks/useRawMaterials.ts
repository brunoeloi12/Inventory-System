import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface RawMaterial {
  id: string;
  name: string;
  code: string;
  stockQuantity: number;
}

export const useRawMaterials = () => {
  return useQuery({
    queryKey: ["raw-materials"],
    queryFn: async () => {
      const { data } = await api.get<RawMaterial[]>("/raw-materials");
      return data;
    },
  });
};

export const useCreateRawMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => api.post("/raw-materials", data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] }),
  });
};

export const useUpdateRawMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: any) =>
      api.put(`/raw-materials/${id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] }),
  });
};

export const useDeleteRawMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/raw-materials/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] }),
  });
};
