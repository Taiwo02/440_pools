import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const wemaHttp = axios.create({
  baseURL: "https://lendnode.creditclan.com/gateway/wema/api/v3",
});

interface WalletBalance {
  balance: number;
  wallet_balance: number;
}

export const useGetWalletBalance = (merchantId: number | string | undefined) => {
  return useQuery<WalletBalance>({
    queryKey: ["wallet-balance", merchantId],
    queryFn: async () => {
      const res = await wemaHttp.post("/wema/virtual_balance", {
        merchant_id: merchantId,
      });
      return res?.data?.data;
    },
    enabled: !!merchantId,
  });
};
