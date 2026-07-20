"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "@/lib/api";

interface User {
  id: number;
  full_name?: string;
  name?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (user: User) => void;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {

    try {

      const response =
        await api.get("/auth/me");

      setUser(response.data);

    } catch {

      setUser(null);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    refreshUser();

  }, []);

  function login(user: User) {

    setUser(user);

  }

  async function logout() {
    try {
        await api.post("/auth/logout");
    }   catch (error) {
        console.error("Logout failed:", error);
    }   finally {
        setUser(null);
    }
  }

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  return useContext(AuthContext);

}