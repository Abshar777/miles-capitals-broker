"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
};

const AuthCheckbox = ({ id, checked, onChange, children }: Props) => (
  <div className="flex items-center gap-2">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={(v) => onChange(v === true)}
      className="size-6 rounded-[4px] border-muted-foreground bg-transparent dark:bg-transparent data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-black shadow-none"
    />
    <label htmlFor={id} className="text-[15px] leading-6 text-foreground cursor-pointer select-none">
      {children}
    </label>
  </div>
);

export default AuthCheckbox;
