import http, { noToken } from "@/lib/http"
import { useQuery } from "@tanstack/react-query"

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await noToken.get("/products?start_date=null&end_date=null&category=null");
      return res?.data;
    },
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await http.get("/admin/categories");
      return res?.data?.data;
    },
  });
};

export const useGetMarkets = () => {
  return useQuery({
    queryKey: ["market"],
    queryFn: async () => {
      const res = await http.get("/admin/markets");
      return res?.data?.data?.markets;
    },
  });
};

export const useGetSupplier = (id: number, options?: any) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: async () => {
      const res = await http.get(`/admin/supplier/${id}`);
      return res?.data?.data;
    },
    enabled: !!id,
    ...options,
  });
};