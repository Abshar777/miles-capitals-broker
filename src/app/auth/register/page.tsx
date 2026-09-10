"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { AuthTitle } from "@/components/auth/AuthText";
import BackLink from "@/components/auth/BackLink";
import RegisterForm from "@/components/forms/registerForm";

const page = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("referral");
  return (
    <AuthCard after={<BackLink href="/auth/landing" />}>
      <AuthTitle>Enter Account Details</AuthTitle>
      <RegisterForm code={code ?? undefined} />
    </AuthCard>
  );
};

export default page;
