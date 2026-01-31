"use client"

import { ToastProvider } from "@/components/ui/toast/ToastContext";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider placement="bottom-right">
          {children}
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Providers
