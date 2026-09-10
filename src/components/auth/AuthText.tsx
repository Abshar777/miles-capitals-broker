import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const AuthTitle = ({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) => (
  <h1 className={cn("text-[22px] leading-8 font-medium text-foreground", center && "text-center")}>
    {children}
  </h1>
);

export const AuthSubtitle = ({
  children,
  center = false,
  className,
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) => (
  <p
    className={cn(
      "text-[14px] leading-[1.3] text-muted-foreground",
      center && "text-center",
      className
    )}
  >
    {children}
  </p>
);

/** "Don't have an account? Sign up" style footer line. */
export const AuthFooterLine = ({
  text,
  linkText,
  href,
  onClick,
}: {
  text: string;
  linkText: string;
  href?: string;
  onClick?: () => void;
}) => (
  <p className="text-[13px] leading-[1.3] text-muted-foreground text-center">
    {text}{" "}
    {href ? (
      <Link href={href} className="text-primary font-medium hover:text-primary-hover">
        {linkText}
      </Link>
    ) : (
      <button type="button" onClick={onClick} className="text-primary font-medium hover:text-primary-hover">
        {linkText}
      </button>
    )}
  </p>
);
