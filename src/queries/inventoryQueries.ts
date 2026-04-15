"use client";

import { useAuth } from "@clerk/nextjs";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createInventoryItem,
  fetchInventoryItems,
  uploadImage,
} from "@/service";
import type {
  ICreateItemRequest,
  IInventoryItem,
  IInventoryListResponse,
} from "@/types/inventory";

interface ICreateInventoryMutationInput {
  item: ICreateItemRequest;
  imageFile?: File | null;
}

export function useInventoryQuery(
  page: number,
  limit: number,
  type?: string,
  status?: string,
  category?: string,
): UseQueryResult<IInventoryListResponse> {
  const { isLoaded, getToken } = useAuth();

  return useQuery({
    queryKey: ["inventory", page, limit, type, status, category],
    enabled: isLoaded,
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      try {
        return await fetchInventoryItems(
          token,
          type || null,
          status || null,
          category || null,
          page,
          limit,
        );
      } catch (err) {
        toast.error("Failed to fetch inventory items");
        throw err;
      }
    },
  });
}

export function useCreateInventoryItemMutation(): UseMutationResult<
  IInventoryItem,
  Error,
  ICreateInventoryMutationInput
> {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ item, imageFile }) => {
      const token = await getToken();
      if (!token) {
        toast.error("No active session token found");
        throw new Error("No active session token found");
      }

      const payload: ICreateItemRequest = { ...item };

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploaded = await uploadImage(formData);
        payload.image_url = uploaded.url;
      }

      return createInventoryItem(token, payload);
    },
    onSuccess: async () => {
      toast.success("Inventory item created successfully");
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: () => {
      toast.error("Failed to create inventory item");
    },
  });
}
