import { noToken } from "@/lib/http"
import { Bale } from "@/types/types";
import { useQuery } from "@tanstack/react-query"

export const useGetBales = () => {
  return useQuery<Bale[]>({
    queryKey: ["bale"],
    queryFn: async () => {
      const res = await noToken.get("/buyer/bales");
      return res?.data?.data;
    }
  })
}