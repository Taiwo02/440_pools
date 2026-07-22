import http from "@/lib/http";
import { CartResponse, SingleCartItemPayload, UpdateCartItemPayload } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export const useGetCart = () => {
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await http.get("/cart");
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useClearCart = () => {
  return useMutation({
    mutationFn: () => {
      return http.delete("/cart");
    },
  });
};

export const useRemoveCartItem = () => {
  return useMutation({
    mutationFn: (itemId: string) => {
      return http.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useAddCartItem = () => {
  return useMutation({
    mutationFn: (body: SingleCartItemPayload) => {
      return http.post(`/cart/items`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItem = (itemId: string) => {
  return useMutation({
    mutationKey: ["updateCartItem", itemId],
    mutationFn: (body: UpdateCartItemPayload) => {
      return http.patch(`/cart/items/${itemId}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
