"use client";
import React, { useEffect } from "react";
import { useUiStore } from "@/store/uiStore";
import { useTheme } from "next-themes";
import { useUser } from "@/hooks/useUser";
import DashboardLoader from "@/app/root/loading";

const DashboardWall = ({ children }: { children: React.ReactNode }) => {
  const { theme: currentTheme } = useTheme();
  const { isLoading } = useUser();
  const { setTheme, setColor, theme } = useUiStore();

  useEffect(() => {
    if (!currentTheme) return;
    setTheme(currentTheme as "light" | "dark");
    setColor(currentTheme === "light" ? "#199216" : "#199216");
  }, [currentTheme, setTheme, setColor]);

  if (isLoading) return <DashboardLoader />;

  return <>{children}</>;
};

export default DashboardWall;
