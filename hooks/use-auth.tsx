"use client"

import { deleteCrossSubdomainCookie, setCrossSubdomainCookie } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react"

type User = {
  merchant: number;
  name: string;
  phone: string;
  user_type: string;
  completion_details: any;
};

type AuthData = {
  user: User | null;
  token?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  authenticate: (data: AuthData) => void;
  authenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("merchant");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user JSON:", error);
    }
  }, []);

  const authenticate = (data: AuthData) => {
    setUser(data.user);
    if (data.user) {
      localStorage.setItem("merchant", JSON.stringify(data.user));
    }
    setAuthenticated(true);
    if (data.token) {
      setCrossSubdomainCookie("440_token", data.token, 30);
    }
  };

  const logout = () => {
    deleteCrossSubdomainCookie("440_token");
    localStorage.removeItem("merchant");
    window.location.reload();
  }

  return (
    <AuthContext.Provider value={{ user, loading, authenticate, authenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;