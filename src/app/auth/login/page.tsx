"use client";
import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import { AuthSubtitle, AuthTitle } from "@/components/auth/AuthText";
import LoginForm from "@/components/forms/loginForm";

const page = () => {
  return (
    <AuthCard>
      <AuthTitle center>Welcome back</AuthTitle>
      <AuthSubtitle center className="-mt-2 mb-2">
        Sign in to your account
      </AuthSubtitle>
      <LoginForm />
    </AuthCard>
  );
};

export default page;
