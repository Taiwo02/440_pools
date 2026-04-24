import type { Metadata } from "next";
import AccountGuard from "./AccountGuard";
import AccountShell from "@/components/account/AccountShell";

export const metadata: Metadata = {
  title: "My Account",
};

export default function AccountLayout({
  children,
  login,
}: {
  children: React.ReactNode;
  login: React.ReactNode;
}) {
  return (
    <AccountGuard login={login}>
      <AccountShell>{children}</AccountShell>
    </AccountGuard>
  );
}
