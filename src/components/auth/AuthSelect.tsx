"use client";
import { Icon } from "@/components/ui/icon";
import React from "react";
import Flag from "react-world-flags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel } from "./AuthField";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string; flag?: string };

type Props = {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
};

/** 56px field-styled dropdown with optional flag, matching the reference select. */
const AuthSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  className,
  triggerClassName,
}: Props) => (
  <div className={cn("w-full", className)}>
    {label && <FieldLabel>{label}</FieldLabel>}
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-14 data-[size=default]:h-14 w-full rounded-[4px] border border-field bg-field dark:bg-field dark:hover:bg-field px-4 text-[15px] text-foreground shadow-none focus-visible:ring-0 focus-visible:border-primary/60",
          triggerClassName
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-card border-border rounded-[4px] max-h-72">
        {options.map((o) => (
          <SelectItem
            key={o.value}
            value={o.value}
            className="text-[15px] text-foreground focus:bg-field focus:text-foreground cursor-pointer rounded-[4px]"
          >
            <span className="flex items-center gap-2">
              {o.flag && <Flag code={o.flag} className="w-4 h-4 rounded-full object-cover" />}
              {o.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default AuthSelect;
