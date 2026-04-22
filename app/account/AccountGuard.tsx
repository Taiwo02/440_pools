"use client";

import { useEffect, useState } from "react";
import { getCrossSubdomainCookie } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  login: React.ReactNode;
};

export default function AccountGuard({ children, login }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const merchant = localStorage.getItem("merchant");
    const token = getCrossSubdomainCookie("440_token");
    setIsLoggedIn(Boolean(merchant && token));
  }, []);

  // Prevent hydration mismatch
  if (!isLoggedIn) {
    return login;
  }

  return children;
}
