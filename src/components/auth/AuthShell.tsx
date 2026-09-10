"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import AuthHeader from "./AuthHeader";
import AuthFooter from "./AuthFooter";

type AuthTheme = "dark" | "light";

const AuthThemeContext = createContext<{
  theme: AuthTheme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export const useAuthTheme = () => useContext(AuthThemeContext);

const STORAGE_KEY = "auth-theme";

/**
 * Frame shared by every /auth page: dark-first theme wrapper, 80px header
 * with logo + theme toggle + language chip, centered content and a 48px
 * version footer. Mirrors the reference portal layout.
 */
const AuthShell = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<AuthTheme>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AuthTheme | null;
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  };

  return (
    <AuthThemeContext.Provider value={{ theme, toggle }}>
      <div
        className={cn(
          theme === "dark" && "dark",
          "auth-shell min-h-screen flex flex-col bg-background text-foreground font-sans text-[15px] leading-6"
        )}
      >
        <AuthHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <AuthFooter />
      </div>
    </AuthThemeContext.Provider>
  );
};

export default AuthShell;
