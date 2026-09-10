"use client";
import { useSession } from "next-auth/react";
import AuthCard from "@/components/auth/AuthCard";
import { AuthSubtitle, AuthTitle } from "@/components/auth/AuthText";
import BackLink from "@/components/auth/BackLink";
import OtpForm from "@/components/forms/otpForm";

const OtpPage = () => {
  const { data: session } = useSession();

  return (
    <AuthCard after={<BackLink href="/auth/login" />}>
      <AuthTitle>Verify your email</AuthTitle>
      <AuthSubtitle className="text-[15px] leading-5 -mt-1 mb-1">
        Enter the code we sent to{" "}
        <span className="text-foreground">{session?.user?.email}</span>
      </AuthSubtitle>
      <OtpForm />
    </AuthCard>
  );
};

export default OtpPage;
