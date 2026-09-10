import http from "@/lib/http";
import { MarketParams, MarketResponse, SingleMarket, SingleSupplier, SupplierParams, SupplierResponse } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const useGetSuppliers = (
  params: SupplierParams,
  options?: { enabled?: boolean },
) => {
  return useQuery<SupplierResponse>({
    queryKey: ["suppliers", params],
    queryFn: async () => {
      const res = await http.get("/buyer/suppliers", { params });
      return res.data.data;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useGetSupplierById = (id: string) => {
  return useQuery<SingleSupplier>({
    queryKey: ["supplier", id],
    queryFn: async () => {
      const res = await http.get(`/buyer/supplier/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useGetMarkets = (
  params: MarketParams,
  options?: { enabled?: boolean },
) => {
  return useQuery<MarketResponse>({
    queryKey: ["markets", params],
    queryFn: async () => {
      const res = await http.get("/buyer/markets", { params });
      return res.data.data;
    },
    enabled: options?.enabled ?? true,
  });
};

export const useGetMarketById = (id: string) => {
  return useQuery<SingleMarket>({
    queryKey: ["market", id],
    queryFn: async () => {
      const res = await http.get(`/buyer/market/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};