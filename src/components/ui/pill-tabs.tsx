"use client";
import React from "react";
import { cn } from "@/lib/utils";

export type PillOption<T extends string = string> = { value: T; label: string };

type Props<T extends string> = {
  options: PillOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
};

/**
 * Reference pill filter: 32px tall, 32px radius, 2px 16px padding.
 * Active = gold border + 10% gold fill + white text. Inactive = divider border + grey text.
 */
export function PillTabs<T extends string>({ options, value, onChange, className }: Props<T>) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 rounded-[32px] border px-4 py-[2px] text-[15px] leading-6 transition-colors whitespace-nowrap",
              active
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default PillTabs;
