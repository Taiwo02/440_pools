import { noToken } from "@/lib/http"
import { SingleBale } from "@/types/baletype";
import { Bale, BaleFilters } from "@/types/types";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
// @ts-ignore
import qs from "qs";

export const useGetBales = (params: BaleFilters) => {
  return useQuery<Bale[]>({
    queryKey: ["bale", params],
    queryFn: async () => {
      const res = await noToken.get("/buyer/bales", {
        params: {
          categories: params.categories,
          "priceRange[min]": params.priceRange?.min,
          "priceRange[max]": params.priceRange?.max,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "brackets" }),
      });

      return res?.data?.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetInfiniteBales = (filters: BaleFilters) => {
  return useInfiniteQuery({
    queryKey: ["bales", filters.limit],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await noToken.get("/buyer/bales", {
        params: {
          ...filters,
          page: pageParam,
        },
      });

      return res.data;
    },

    getNextPageParam: (lastPage, allPages) => {
      const limit = filters.limit || 12;

      // IMPORTANT: your data is inside lastPage.data
      if (lastPage.data.length < limit) {
        return undefined; // no more pages
      }

      return allPages.length + 1; // next page
    },
  });
};

export const useGetSingleBale = (id: string) => {
  return useQuery<SingleBale>({
    queryKey: ["bale", id],
    queryFn: async () => {
      const res = await noToken.get(`/buyer/bale/${id}`);
      const bale = res?.data?.data;

      if (!bale) {
        throw new Error("Bale not found");
      }

      return bale;
    },
    enabled: !!id
  });
};
