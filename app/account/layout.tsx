import type { Metadata } from "next";
import AccountGuard from "./AccountGuard";

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
      {children}
    </AccountGuard>
  );
}
