"use client";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { supabase } from "@/lib/supabase/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  user: any;
  getUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  user: any;
  children: ReactNode;
};

export const AuthProvider = ({
  user: initialUser,
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState(initialUser);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getRoles = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const roles = getTokenRoles(session);
      console.log("roles:", roles);
    };

    getRoles();
  }, []);

  return (
    <AuthContext.Provider value={{ user, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
