"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "@/lib/apiAuth";
import type { User } from "@shared/types/User";

type AuthContextType = {
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: {},
  setUser: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((data) => {
      if (data?.user) setUser(data.user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
