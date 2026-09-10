import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  tone?: "default" | "positive" | "light";
  className?: string;
};

/**
 * Reference ds-tag: field-navy chip, 4px radius.
 * `default` = 10px grey (wallet/account meta), `positive` = green tint (Live),
 * `light` = 15px white on navy (MT5 chip on dashboard cards).
 */
export const TagChip = ({ children, tone = "default", className }: Props) => (
  <span
    className={cn(
      "inline-flex items-center rounded-[4px] whitespace-nowrap",
      tone === "light"
        ? "h-6 px-2 text-[15px] leading-5 bg-field text-foreground"
        : "h-4 px-1.5 text-[10px] leading-4",
      tone === "default" && "bg-field text-muted-foreground",
      tone === "positive" && "bg-positive/20 text-foreground",
      className
    )}
  >
    {children}
  </span>
);

export default TagChip;
