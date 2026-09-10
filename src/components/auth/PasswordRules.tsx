import React from "react";
import { cn } from "@/lib/utils";

const RULES: { label: string; test: (v: string) => boolean }[] = [
  { label: "8 symbols", test: (v) => v.length >= 8 },
  { label: "1 lower-case letter", test: (v) => /[a-z]/.test(v) },
  { label: "1 number", test: (v) => /\d/.test(v) },
  { label: "1 special character: !@#$%^&*()-_}{.+", test: (v) => /[!@#$%^&*()\-_}{.+]/.test(v) },
  { label: "1 upper-case letter", test: (v) => /[A-Z]/.test(v) },
];

/** Bullet list shown under the password field on the reference sign-up. */
const PasswordRules = ({ value = "" }: { value?: string }) => (
  <ul className="mt-2 pl-4 list-disc text-[12px] leading-5 text-muted-foreground">
    {RULES.map((r) => (
      <li key={r.label} className={cn(value && r.test(value) && "text-positive")}>
        {r.label}
      </li>
    ))}
  </ul>
);

export default PasswordRules;
