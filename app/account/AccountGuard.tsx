"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  login: React.ReactNode;
};

export default function AccountGuard({ children, login }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const merchant = localStorage.getItem("merchant");
    setIsLoggedIn(!!merchant);
  }, []);

  // Prevent hydration mismatch
  if (!isLoggedIn) {
    return login;
  }

  return children;
}
