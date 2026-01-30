import { noToken } from "@/lib/http"
import { useQuery } from "@tanstack/react-query"

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await noToken.get("/products?start_date=null&end_date=null&category=null");
      return res?.data;
    }
  })
}