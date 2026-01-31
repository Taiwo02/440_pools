import { noToken } from "@/lib/http"
import { SingleBale } from "@/types/baletype";
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

export const useGetSingleBale = (id: string) => {
  return useQuery<SingleBale>({
    queryKey: ["bale", id],
    queryFn: async () => {
      const res = await noToken.get(`/buyer/bale?id=${id}`);
      return res?.data?.data[0];
    },
    enabled: !!id,
  })
}