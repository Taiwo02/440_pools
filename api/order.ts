import http from "@/lib/http";
import { CheckoutPayload, DirectInitiate, DirectOrderPayload, InitiatePayment } from "@/types/checkout";
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

// Slot payment endpoints
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
    mutationFn: (body: InitiatePayment) => {
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
// End of slot payment endpoints

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

export const useGetSingleOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await http.get(`/buyer/orders/${id}`);
      return res?.data?.data;
    },
    enabled: !!id
  });
};
// End of orders

// Direct Order Endpoints
export const useDirectOrder = () => {
  return useMutation({
    mutationFn: (body: DirectOrderPayload) => {
      return http.post('/buyer/direct-order', body);
    }
  });
}

export const useInitiateDirectPayment = () => {
  return useMutation({
    mutationFn: ({ type, id }: DirectInitiate) => {
      return http.post(`/buyer/direct-order/${id}/initiate-payment`, {type});
    },
  });
};