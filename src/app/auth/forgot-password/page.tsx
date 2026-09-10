"use client";
import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import { AuthSubtitle, AuthTitle } from "@/components/auth/AuthText";
import BackLink from "@/components/auth/BackLink";
import ForgotForm from "@/components/forms/forgotForm";

const page = () => {
  return (
    <AuthCard after={<BackLink href="/auth/login" />}>
      <AuthTitle>Reset Password</AuthTitle>
      <AuthSubtitle className="text-[15px] leading-5 -mt-1 mb-1">
        Enter the email address you used when you joined and we’ll send you instructions to reset
        your password
      </AuthSubtitle>
      <ForgotForm />
    </AuthCard>
  );
};

export default page;
