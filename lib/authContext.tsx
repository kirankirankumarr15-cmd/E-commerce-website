"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseBrowser";

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: "customer" | "admin" | "partner";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  addresses: UserAddress[];
  addAddress: (addr: Omit<UserAddress, "id">) => void;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, name: string, password?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loginDemo: (role?: "customer" | "admin" | "partner") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_ADDRESS: UserAddress = {
  id: "addr-default-1",
  fullName: "Kiran Kumar",
  phone: "+91 98765 43210",
  street: "Flat 402, Green Glen Layout, Bellandur",
  city: "Bangalore",
  state: "Karnataka",
  pincode: "560103",
  isDefault: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([DEFAULT_ADDRESS]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent demo user or session
    const saved = localStorage.getItem("nova_auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    } else {
      // Default to guest customer for friction-free browsing
      const demo: AuthUser = {
        id: "demo-cust-001",
        email: "customer@novamart.in",
        name: "Kiran",
        role: "customer",
      };
      setUser(demo);
      localStorage.setItem("nova_auth_user", JSON.stringify(demo));
    }

    const savedAddr = localStorage.getItem("nova_user_addresses");
    if (savedAddr) {
      try {
        setAddresses(JSON.parse(savedAddr));
      } catch {
        // ignore
      }
    }

    setLoading(false);
  }, []);

  const addAddress = (addr: Omit<UserAddress, "id">) => {
    const newAddr: UserAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => {
      const updated = [newAddr, ...prev];
      localStorage.setItem("nova_user_addresses", JSON.stringify(updated));
      return updated;
    });
  };

  const signIn = async (email: string, password?: string) => {
    setLoading(true);
    try {
      if (password) {
        await supabase.auth.signInWithPassword({ email, password }).catch(() => null);
      }
      const role = email.includes("admin") ? "admin" : email.includes("partner") ? "partner" : "customer";
      const u: AuthUser = {
        id: `usr-${Date.now()}`,
        email,
        name: email.split("@")[0],
        role,
      };
      setUser(u);
      localStorage.setItem("nova_auth_user", JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, name: string, password?: string) => {
    setLoading(true);
    try {
      if (password) {
        await supabase.auth.signUp({ email, password }).catch(() => null);
      }
      const u: AuthUser = {
        id: `usr-${Date.now()}`,
        email,
        name,
        role: "customer",
      };
      setUser(u);
      localStorage.setItem("nova_auth_user", JSON.stringify(u));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut().catch(() => null);
    localStorage.removeItem("nova_auth_user");
    setUser(null);
  };

  const loginDemo = (role: "customer" | "admin" | "partner" = "customer") => {
    const demo: AuthUser = {
      id: role === "admin" ? "demo-admin-001" : role === "partner" ? "demo-partner-001" : "demo-cust-001",
      email: `${role}@novamart.in`,
      name: role === "admin" ? "Store Admin" : role === "partner" ? "Ravi (Delivery)" : "Kiran",
      role,
    };
    setUser(demo);
    localStorage.setItem("nova_auth_user", JSON.stringify(demo));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        addresses,
        addAddress,
        signIn,
        signUp,
        signOut,
        loginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
