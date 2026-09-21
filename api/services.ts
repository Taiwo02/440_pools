import http from "@/lib/http";
import { InspectionRequestType, LogisticsFormPayload, VerifySupplierRequest } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateLogisticsRequest = () => {
  return useMutation({
    mutationKey: ["logistics"],
    mutationFn: async (body: LogisticsFormPayload) => {
      return await http.post("/service-orders/logistics", body);
    },
  });
};

export const useGetInspectionRates = () => {
  return useQuery({
    queryKey: ["inspection-rate"],
    queryFn: async () => {
      const res = await http.get("/rates/inspection");
      return res.data.data;
    },
  });
};

export const useCreateInspectionRequest = () => {
  return useMutation({
    mutationKey: ["inspection-request"],
    mutationFn: async (body: InspectionRequestType) => {
      return await http.post("/inspection/requests", body);
    },
  });
};

export const useCreateVerifyRequest = () => {
  return useMutation({
    mutationKey: ["supplier-verification"],
    mutationFn: async (body: VerifySupplierRequest) => {
      return await http.post("/supplier-verification/requests", body);
    },
  });
};