"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AuthField from "../auth/AuthField";
import AuthButton from "../auth/AuthButton";
import { AuthFooterLine } from "../auth/AuthText";

const LoginForm = () => {
  const { register, onFormSubmit, errors, isPending, watch } = useAuth("login");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ssoLoading, setSsoLoading] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);

  const email = watch("email");
  const password = watch("password");
  const canSubmit = !!email && !!password && password.length >= 8;

  useEffect(() => {
    const ssoToken = searchParams.get("sso");
    if (!ssoToken) return;
    setSsoLoading(true);
    axios
      .post("/proxy/api/v1/auth/sso-login", { ssoToken })
      .then((res) => {
        const token = res.data?.access_token;
        if (token) {
          localStorage.setItem("__accessToken", token);
          router.replace("/dashboard");
        } else {
          setSsoLoading(false);
          setSsoError("SSO login failed. Please sign in manually.");
        }
      })
      .catch(() => {
        setSsoLoading(false);
        setSsoError("SSO login failed. Please sign in manually.");
      });
  }, [searchParams, router]);

  if (ssoLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-[14px] text-muted-foreground">Signing you in via Root ERP…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onFormSubmit} className="w-full flex flex-col gap-4" noValidate>
      {ssoError && (
        <p className="w-full rounded-[4px] bg-destructive/10 border border-destructive/30 px-4 py-3 text-[14px] text-destructive">
          {ssoError}
        </p>
      )}

      <AuthField
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        register={register}
        errors={errors}
      />

      <div>
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          register={register}
          errors={errors}
        />
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-[12px] leading-6 text-primary hover:text-primary-hover"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="mt-2">
        <AuthButton type="submit" disabled={!canSubmit} isLoading={isPending}>
          Log In
        </AuthButton>
      </div>

      <AuthFooterLine text="Don’t have an account?" linkText="Sign up" href="/auth/register" />
    </form>
  );
};

export default LoginForm;
