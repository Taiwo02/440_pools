import http from "@/lib/http";
import { CheckoutPayload } from "@/types/checkout";
import { BaleSlot, DeliveryPayload, Initiate } from "@/types/types";
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
    mutationFn: ({merchantId, ...body}: CheckoutPayload) => {
      return http.post(`/buyer/order?merchantId=${merchantId}`, body);
    },
  });
};

export const useCreateBaleSlot = () => {
  return useMutation({
    mutationFn: (body: BaleSlot) => {
      return http.post(`/buyer/checkout-intent`, body);
    },
  });
};

export const useInitiateSlotPayment = () => {
  return useMutation({
    mutationFn: (body: Initiate) => {
      return http.post(`/buyer/initiate-payment`, body);
    },
  });
};