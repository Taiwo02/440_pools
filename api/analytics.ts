import http from "@/lib/http";
import { AnalyticsBatch, AnalyticsPayload } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

export const useSendAnalytics = () => {
  return useMutation({
    mutationFn: (payload: AnalyticsPayload) => {
      return http.post("/analytics/events", payload);
    },
  });
};

export const useSendAnalyticsBatch = () => {
  return useMutation({
    mutationFn: (payload: AnalyticsBatch) => {
      return http.post("/analytics/events/batch", payload);
    },
  });
};