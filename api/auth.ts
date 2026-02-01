import { noToken } from "@/lib/http"
import { userHttp } from "@/lib/user_auth";
import { Login, ProfileData, RegisterPayload } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (body: RegisterPayload) => {
      return userHttp.post("/register", body);
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (body: Login) => {
      return userHttp.post("/login", body);
    },
  });
};

export const useGetUserProfile = () => {
  return useQuery<ProfileData>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await userHttp.get("/profile");
      return res?.data?.data;
    }
  })
};