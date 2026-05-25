import http from "@/lib/http";
import { ReviewPayload } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateReview = () => {
  return useMutation({
    mutationFn: (body: ReviewPayload) => {
      return http.post('/buyer/review', body);
    },
  });
};

export const useGetProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      const res = await http.get(`/buyer/review/product/${productId}`);
      return res?.data;
    },
    enabled: !!productId,
  });
};

export const useGetProductRatings = (productId: string) => {
  return useQuery({
    queryKey: ['product-ratings', productId],
    queryFn: async () => {
      const res = await http.get(`/buyer/review/rating/${productId}`);
      return res?.data;
    },
    enabled: !!productId,
  });
};

export const useDeleteReview = () => {
  return useMutation({
    mutationFn: (id: number) => {
      return http.delete(`/buyer/review/${id}`)
    }
  });
};