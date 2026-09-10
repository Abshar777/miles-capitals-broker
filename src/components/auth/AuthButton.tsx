"use client";
import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Reference button: gold fill, black text, 4px radius.
 * lg = 56px tall (forms), md = 40px tall (header).
 */
const AuthButton = ({
  children,
  type = "button",
  variant = "primary",
  size = "lg",
  fullWidth = false,
  disabled = false,
  isLoading = false,
  href,
  onClick,
  className,
}: Props) => {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-[4px] text-[13.33px] font-normal whitespace-nowrap select-none cursor-pointer outline outline-1 -outline-offset-1 outline-transparent transition-[outline-color,filter] duration-150 ease-in-out",
    size === "lg" ? "h-14 px-6 py-[14px]" : "h-10 px-6 py-2",
    variant === "primary"
      ? "bg-primary text-black hover:brightness-110 hover:outline-primary"
      : "bg-field text-foreground hover:outline-primary/40",
    (disabled || isLoading) && "cursor-not-allowed hover:brightness-100 hover:outline-transparent",
    disabled && variant === "primary" && "text-black/30",
    disabled && variant === "secondary" && "opacity-50",
    fullWidth && "w-full",
    className
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled || isLoading} onClick={onClick} className={classes}>
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export default AuthButton;
