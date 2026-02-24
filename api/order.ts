import http from "@/lib/http";
import { CheckoutPayload } from "@/types/checkout";
import { BaleSlot, DeliveryPayload, Initiate } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

// Deliveries
export const useDeliveryMutation = () => {
  return useMutation({
    mutationFn: ({ merchantId, ...body }: DeliveryPayload) => {
      return http.post(`/buyer/delivery?merchantId=${merchantId}`, body);
    },
  });
};

export const useGetDeliveries = () => {
  return useQuery({
    queryKey: ["delivery"],
    queryFn: async () => {
      const res = await http.get("/buyer/deliveries");
      return res?.data?.data ?? [];
    }
  });
}

export const useOrderMutation = () => {
  return useMutation({
    mutationFn: ({merchantId, ...body}: CheckoutPayload) => {
      return http.post(`/buyer/order?merchantId=${merchantId}`, body);
    },
  });
};

// Create Bale slot
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

// Confirm Payment
export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: async (reference: string) => {
      const res = await http.get(
        `/buyer/confirm-payment?reference=${reference}`
      );
      return res?.data?.data;
    }
  });
};

// Orders
export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const res = await http.get("/buyer/orders");
      return res?.data?.data?.data ?? [];
    }
  });
};