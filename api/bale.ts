import { noToken } from "@/lib/http"
import { SingleBale } from "@/types/baletype";
import { Bale, BaleFilters } from "@/types/types";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
// @ts-ignore
import qs from "qs";

const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 99999999;
const DEFAULT_LIMIT = 12;

const buildBalesQueryParams = (
  filters: BaleFilters,
  page?: number
) => {
  const params: Record<string, unknown> = {
    limit: filters.limit ?? DEFAULT_LIMIT,
    page: page ?? filters.page ?? 1,
  };

  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.productId != null) params.productId = filters.productId;
  if (filters.isSpecial != null) params.isSpecial = filters.isSpecial;
  if (filters.status) params.status = filters.status;
  if (filters.shipmentId != null) params.shipmentId = filters.shipmentId;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.supplierRating?.trim()) params.supplierRating = filters.supplierRating;
  if (filters.categories?.length) params.categories = filters.categories;
  if (filters.marketLocation?.length) params.marketLocation = filters.marketLocation;

  const min = filters.priceRange?.min;
  const max = filters.priceRange?.max;
  const hasCustomPriceRange =
    min != null &&
    max != null &&
    (min !== DEFAULT_PRICE_MIN || max !== DEFAULT_PRICE_MAX);

  if (hasCustomPriceRange) {
    params["priceRange[min]"] = min;
    params["priceRange[max]"] = max;
  }

  return params;
};

export const useGetBales = (params: BaleFilters) => {
  return useQuery<Bale[]>({
    queryKey: ["bale", params],
    queryFn: async () => {
      const res = await noToken.get("/buyer/bales", {
        params: buildBalesQueryParams(params),
        paramsSerializer: (queryParams) =>
          qs.stringify(queryParams, { arrayFormat: "brackets", skipNulls: true }),
      });

      return res?.data?.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetInfiniteBales = (filters: BaleFilters) => {
  return useInfiniteQuery({
    queryKey: ["bales", filters],
    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await noToken.get("/buyer/bales", {
        params: buildBalesQueryParams(filters, pageParam),
        paramsSerializer: (p) =>
          qs.stringify(p, { arrayFormat: "brackets", skipNulls: true }),
      });

      return res.data;
    },

    getNextPageParam: (lastPage, allPages) => {
      const limit = filters.limit || 12;

      if (lastPage.data.length < limit) {
        return undefined;
      }

      return allPages.length + 1;
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
