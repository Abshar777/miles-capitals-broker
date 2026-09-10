"use client";
import React, { useEffect, useState } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { countryCodes } from "@/constants/countries";
import AuthSelect from "./AuthSelect";
import { FieldError, FieldLabel, fieldBoxClass } from "./AuthField";

type Props = {
  label?: string;
  name: string;
  /** Country name (e.g. "India") — the dial code follows it. */
  country?: string;
  setValue: (name: string, value: string, opts?: any) => void;
  errors?: FieldErrors<FieldValues>;
  placeholder?: string;
};

const uniqueCodes = countryCodes.filter(
  (c, i, arr) => arr.findIndex((x) => x.code === c.code) === i
);

/**
 * Dial-code selector + number input. Writes "+44 1234567" into the form so the
 * existing zod schema and backend payload stay unchanged.
 */
const AuthPhone = ({
  label,
  name,
  country,
  setValue,
  errors,
  placeholder = "Enter Phone number",
}: Props) => {
  const [code, setCode] = useState<string>(() => {
    const match = countryCodes.find((c) => c.name === country);
    return match?.code || "+91";
  });
  const [number, setNumber] = useState("");

  // Follow the country dropdown when it changes.
  useEffect(() => {
    const match = countryCodes.find((c) => c.name === country);
    if (match && match.code !== code) setCode(match.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  useEffect(() => {
    setValue(name, number ? `${code} ${number}` : "", {
      shouldValidate: number.length > 0,
      shouldDirty: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, number]);

  return (
    <div className="w-full">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex gap-2">
        <AuthSelect
          value={code}
          onChange={setCode}
          className="w-auto shrink-0"
          triggerClassName="w-[122px] px-4"
          options={uniqueCodes.map((c) => ({ value: c.code, label: c.code, flag: c.country }))}
        />
        <div className={fieldBoxClass}>
          <input
            id={`auth-${name}`}
            type="tel"
            inputMode="tel"
            placeholder={placeholder}
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/[^\d\s()-]/g, ""))}
            className="flex-1 h-full min-w-0 bg-transparent px-[15px] text-[15px] leading-6 text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>
      <FieldError name={name} errors={errors} />
    </div>
  );
};

export default AuthPhone;
