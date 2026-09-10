"use client";
import { Icon } from "@/components/ui/icon";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Flag from "react-world-flags";
import { useAuthTheme } from "./AuthShell";
import AuthButton from "./AuthButton";

const AuthHeader = () => {
  const pathname = usePathname();
  const { theme, toggle } = useAuthTheme();
  const isLanding = pathname?.startsWith("/auth/landing");

  return (
    <header className="h-20 flex items-center pl-4 pr-8 shrink-0">
      <Link href="/auth/landing" className="flex items-center" aria-label="Miles Capital">
        <img
          src={theme === "dark" ? "/miles/logo-dark.svg" : "/miles/logo-light.svg"}
          alt="Miles Capital"
          width={240}
          height={64}
          className="h-16 w-auto max-w-[240px]"
        />
      </Link>

      <div className="flex-1 flex items-center justify-end gap-2">
        {isLanding && (
          <>
            <AuthButton href="/auth/register" size="md" className="hidden sm:inline-flex">
              Create Account
            </AuthButton>
            <AuthButton href="/auth/login" size="md" variant="secondary">
              Log In
            </AuthButton>
          </>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="size-8 flex items-center justify-center rounded-[4px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Icon name="sun-16" size={16} /> : <Icon name="moon-16" size={16} />}
        </button>

        <div className="flex items-center gap-1 h-6 text-muted-foreground select-none">
          <Flag code="GB" className="w-4 h-4 rounded-full object-cover" />
          <span className="text-[15px] leading-6">EN</span>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
