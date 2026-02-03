import http from "@/lib/http";
import { DeliveryPayload } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

export const useDeliveryMutation = () => {
  return useMutation({
    mutationFn: ({ merchantId, ...body }: DeliveryPayload) => {
      return http.post(`/buyer/delivery?merchantId=${merchantId}`, body);
    },
  });
};

export const useOrderMutation = () => {
  return useMutation({
    mutationFn: (body, merchantId) => {
      return http.post(`/buyer/order?merchantId=${merchantId}`, body);
    },
  });
};