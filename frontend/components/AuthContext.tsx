"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  role_label: string;
  district: string;
  email: string;
  initial: string;
}

export const DEMO_USERS: Record<string, AuthUser> = {
  ankit: {
    id: "ankit",
    name: "Ankit Sharma",
    role: "state_authority",
    role_label: "State Administrator",
    district: "Uttarakhand & Northeast Command",
    email: "admin@terrashield.gov.in",
    initial: "A",
  },
  mehta: {
    id: "mehta",
    name: "R. Mehta",
    role: "dm",
    role_label: "District Officer (Chamoli)",
    district: "Chamoli",
    email: "officer@chamoli.gov.in",
    initial: "R",
  },
  singh: {
    id: "singh",
    name: "P. Singh",
    role: "dmo",
    role_label: "Risk Analyst",
    district: "National / State SDMA",
    email: "analyst@ndma.gov.in",
    initial: "P",
  },
};

/**
 * Computes official welcome name according to specification:
 * - Ankit Sharma -> "Welcome back, Ankit"
 * - R. Mehta -> "Welcome back, R. Mehta"
 * - P. Singh -> "Welcome back, P. Singh"
 */
export function getWelcomeName(fullName: string): string {
  if (!fullName) return "Officer";
  if (fullName.includes("Ankit")) return "Ankit";
  if (fullName.includes("Mehta")) return "R. Mehta";
  if (fullName.includes("Singh")) return "P. Singh";
  return fullName.split(" ")[0];
}

interface AuthContextType {
  user: AuthUser;
  welcomeName: string;
  login: (user: Partial<AuthUser>) => void;
  logout: () => void;
  switchDemoUser: (idOrEmail: string) => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS.ankit,
  welcomeName: "Ankit",
  login: () => {},
  logout: () => {},
  switchDemoUser: () => {},
  isReady: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(DEMO_USERS.ankit);
  const [isReady, setIsReady] = useState(false);

  const syncUserFromStorage = () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("terrashield_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Find matching predefined demo user
        const match = Object.values(DEMO_USERS).find(
          (u) =>
            u.id === parsed.id ||
            u.email?.toLowerCase() === (parsed.email || "").toLowerCase() ||
            u.name?.toLowerCase() === (parsed.name || "").toLowerCase()
        );
        if (match) {
          setUser(match);
        } else if (parsed.name) {
          setUser({
            id: parsed.id || "custom",
            name: parsed.name,
            role: parsed.role || "state_authority",
            role_label: parsed.role_label || parsed.title || "State Administrator",
            district: parsed.district || parsed.jurisdiction_district || "District Operations",
            email: parsed.email || "officer@terrashield.gov.in",
            initial: parsed.name.charAt(0).toUpperCase(),
          });
        }
      } catch (e) {
        console.error("Failed to parse terrashield_user from storage", e);
      }
    }
  };

  useEffect(() => {
    syncUserFromStorage();
    setIsReady(true);

    const handleStorageChange = () => {
      syncUserFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData: Partial<AuthUser>) => {
    const match = Object.values(DEMO_USERS).find(
      (u) =>
        (userData.id && u.id === userData.id) ||
        (userData.email && u.email?.toLowerCase() === userData.email.toLowerCase()) ||
        (userData.name && u.name?.toLowerCase() === userData.name.toLowerCase())
    );

    const newUser: AuthUser = match
      ? match
      : {
          id: userData.id || "custom",
          name: userData.name || DEMO_USERS.ankit.name,
          role: userData.role || DEMO_USERS.ankit.role,
          role_label: userData.role_label || DEMO_USERS.ankit.role_label,
          district: userData.district || DEMO_USERS.ankit.district,
          email: userData.email || DEMO_USERS.ankit.email,
          initial: (userData.name || DEMO_USERS.ankit.name).charAt(0).toUpperCase(),
        };

    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("terrashield_user", JSON.stringify(newUser));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const switchDemoUser = (idOrEmail: string) => {
    const target =
      DEMO_USERS[idOrEmail] ||
      Object.values(DEMO_USERS).find(
        (u) =>
          u.id === idOrEmail ||
          u.email.toLowerCase() === idOrEmail.toLowerCase() ||
          u.name.toLowerCase() === idOrEmail.toLowerCase()
      );

    if (target) {
      login(target);
    }
  };

  const logout = () => {
    setUser(DEMO_USERS.ankit);
    if (typeof window !== "undefined") {
      localStorage.removeItem("terrashield_user");
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        welcomeName: getWelcomeName(user.name),
        login,
        logout,
        switchDemoUser,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
