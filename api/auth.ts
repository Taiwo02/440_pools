import { noToken } from "@/lib/http"
import { userHttp } from "@/lib/user_auth";
import { Login, RegisterPayload } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"

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