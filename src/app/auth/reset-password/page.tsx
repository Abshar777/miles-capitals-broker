"use client";
import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import { AuthSubtitle, AuthTitle } from "@/components/auth/AuthText";
import BackLink from "@/components/auth/BackLink";
import ResetForm from "@/components/forms/resetForm";

const page = () => {
  return (
    <AuthCard after={<BackLink href="/auth/login" />}>
      <AuthTitle>Reset Password</AuthTitle>
      <AuthSubtitle className="text-[15px] leading-5 -mt-1 mb-1">
        Enter your new password
      </AuthSubtitle>
      <ResetForm />
    </AuthCard>
  );
};

export default page;
