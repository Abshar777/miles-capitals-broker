"use client";
import { HeroUIProvider } from "@heroui/system";
import React, { Suspense, useEffect, useState } from "react";
import ReactQueryProvider from "./react-query";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/uiStore";
import NotificationSocketProvider from "./NotificationSocketProvider";

const IndexProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const { theme, setTheme, color, setColor } = useUiStore();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/auth")) {
      setColor("#d4af37");
      setTheme("dark");
    } else if (pathname.startsWith("/root")) {
      setColor("#d4af37");
    }
  }, [theme, pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme((localStorage.getItem("theme") as "light" | "dark") || "dark");
    }
  }, [pathname]);

  return (
    <>
      <NextTopLoader
        height={4}
        shadow={`0 0 10px ${color || "#d4af37"}`}
        color={color || "#d4af37"}
        showSpinner={false}
        zIndex={999999999999999}
      />
      <HeroUIProvider>
        <ReactQueryProvider>
          <Toaster
            visibleToasts={1}
            position="bottom-right"
            theme={"light"}
            richColors
          />
          <SessionProvider session={session}>
            <NotificationSocketProvider />
            <Suspense fallback={<div></div>}>{children}</Suspense>
          </SessionProvider>
        </ReactQueryProvider>
      </HeroUIProvider>
    </>
  );
};

export default IndexProvider;
