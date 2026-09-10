"use client";
import { Icon } from "@/components/ui/icon";
import React, { useState } from "react";
import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  name: string;
  type?: "text" | "email" | "password" | "tel";
  placeholder?: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors<FieldValues>;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/** Label + 56px input container + error, matching the reference field. */
export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-[15px] leading-6 text-muted-foreground mb-2">{children}</span>
);

export const FieldError = ({
  name,
  errors,
}: {
  name: string;
  errors?: FieldErrors<FieldValues>;
}) =>
  errors ? (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }: { message: string }) =>
        message && message !== "Required" ? (
          <p className="text-[13px] leading-4 text-destructive mt-2">{message}</p>
        ) : null
      }
    />
  ) : null;

export const fieldBoxClass =
  "flex items-center h-14 w-full rounded-[4px] bg-field border border-field focus-within:border-primary/60 transition-colors";

const AuthField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  autoComplete,
  maxLength,
  className,
  children,
  onChange,
}: Props) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const reg = register(name);

  return (
    <label className={cn("block w-full", className)} htmlFor={`auth-${name}`}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className={fieldBoxClass}>
        <input
          id={`auth-${name}`}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className="flex-1 h-full min-w-0 bg-transparent px-[15px] text-[15px] leading-6 text-foreground placeholder:text-muted-foreground outline-none"
          {...reg}
          onChange={(e) => {
            reg.onChange(e);
            onChange?.(e);
          }}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="size-8 mr-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {show ? <Icon name="hide-16" size={16} /> : <Icon name="show-16" size={16} />}
          </button>
        )}
      </div>
      {children}
      <FieldError name={name} errors={errors} />
    </label>
  );
};

export default AuthField;
