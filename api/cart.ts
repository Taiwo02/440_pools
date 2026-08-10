import http, { stagingHttp } from "@/lib/http";
import {
  CartResponse,
  SingleCartItemPayload,
  UpdateCartItemPayload,
} from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

type PublicCartParams = {
  phone: string;
  name: string;
};

type PublicCartOptions = {
  enabled?: boolean;
};

type CartOptions = {
  enabled?: boolean;
};

export const useGetCart = (options?: CartOptions) => {
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await stagingHttp.get("/cart");
      return res.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useClearCart = () => {
  return useMutation({
    mutationFn: () => {
      return stagingHttp.delete("/cart");
    },
  });
};

export const useRemoveCartItem = () => {
  return useMutation({
    mutationFn: (itemId: string) => {
      return stagingHttp.delete(`/cart/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useAddCartItem = () => {
  return useMutation({
    mutationFn: (body: SingleCartItemPayload) => {
      return stagingHttp.post(`/cart/items`, body);
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
      return stagingHttp.patch(`/cart/items/${itemId}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Guest cart APIs
export const useAddPublicCartItem = () => {
  return useMutation({
    mutationFn: (body: SingleCartItemPayload) => {
      return stagingHttp.post(`/public/cart/items`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-cart"] });
    },
  });
};

export const useGetPublicCart = (
  params: PublicCartParams,
  options?: PublicCartOptions,
) => {
  return useQuery<CartResponse>({
    queryKey: ["public-cart", params],
    queryFn: async () => {
      const res = await stagingHttp.get("/public/cart", { params });
      return res.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useClearPublicCart = (params: PublicCartParams) => {
  return useMutation({
    mutationFn: () => {
      return stagingHttp.delete("/public/cart", { params });
    },
  });
};

export const useRemovePublicCartItem = (params: PublicCartParams) => {
  return useMutation({
    mutationFn: (itemId: string) => {
      return stagingHttp.delete(`/public/cart/items/${itemId}`, { params });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-cart"] });
    },
  });
};

export const useUpdatePublicCartItem = (itemId: string) => {
  return useMutation({
    mutationKey: ["updateCartItem", itemId],
    mutationFn: (body: UpdateCartItemPayload) => {
      return stagingHttp.patch(`/public/cart/items/${itemId}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-cart"] });
    },
  });
};