import http, { stagingHttp } from "@/lib/http";
import { AnalyticsBatch, AnalyticsPayload } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

export const useSendAnalytics = () => {
  return useMutation({
    mutationFn: (payload: AnalyticsPayload) => {
      return stagingHttp.post("/analytics/events", payload);
    },
  });
};

export const useSendAnalyticsBatch = () => {
  return useMutation({
    mutationFn: (payload: AnalyticsBatch) => {
      return stagingHttp.post("/analytics/events/batch", payload);
    },
  });
};