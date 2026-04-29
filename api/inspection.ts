import http from "@/lib/http";
import { InspectionRequestType, SingleInspection } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateInspection = () => {
  return useMutation({
    mutationFn: (body: InspectionRequestType) => {
      return http.post("/inspection/requests", body, {
        headers: {
          "Idempotency-Key": crypto.randomUUID(),
        },
      });
    },
  });
};

export const useGetInspections = () => {
  return useQuery<SingleInspection[]>({
    queryKey: ["inspection"],
    queryFn: async () => {
      const res = await http.get('/inspection/requests');
      return res?.data?.data
    },
  });
};

export const useGetInspection = (id: number) => {
  return useQuery<SingleInspection>({
    queryKey: ["inspection", id],
    queryFn: async () => {
      const res = await http.get(`/inspection/requests/${id}`);
      return res?.data?.data;
    },
    enabled: !!id
  });
};