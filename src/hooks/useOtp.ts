"use client";

import {
  resendOtpApi,
  resendResetCodeApi,
  verifyOtp,
  verifyResetCode,
} from "@/api/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "nextjs-toploader/app";
import { useSession } from "next-auth/react";

const OTP_EXPIRY_TIME = 1 * 60 * 1000; // 5 minutes

const useOtp = () => {
  const { update } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resend, setResend] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (session?.user?.otpAccess&&!session?.user?.forgetOtpAccess) {
        const { data } = await verifyOtp({
          code: otp.join(""),
          email: session?.user?.email as string,
        });
        toast.success("OTP verified successfully");
        setOtp(Array(6).fill(""));
        router.push("/auth/login");
        update({ verified: true, otpAccess: false });
      } else if (session?.user?.forgetOtpAccess&&session?.user?.otpAccess) {
        const { data } = await verifyResetCode({
          code: otp.join(""),
          email: session?.user?.email as string,
        });
        toast.success("OTP verified successfully");
        setOtp(Array(6).fill(""));
        router.push("/auth/reset-password");
        update({ forgetOtpAccess: false, conformPasswordToken: data?.reset_token });
      } else {
        toast.error("You don't have any OTP access");
      }
    } catch (error) {
      console.log("🔴 error in verify otp", error as Error);
      const err = error as AxiosError;
      const message =
        (err?.response?.data as { error: { message: string } })?.error
          ?.message || "An unexpected error occurred.";
      console.log(message, "message");
      if (message && typeof message == "string") toast.error(message);
      setIsPending(false);
    }
  };

  const startTimer = (createdAt: string) => {
    const expiryTime = new Date(createdAt).getTime() + OTP_EXPIRY_TIME;
    const now = Date.now();
    const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));

    setResend(timeLeft === 0);
  };

  async function resendOtp() {
    setOtp(Array(6).fill(""));
    setIsResendLoading(true);
    try {
      console.log(session?.user);
      if (session?.user?.otpAccess && session?.user?.forgetOtpAccess) {
        await resendResetCodeApi({ email: session?.user?.email as string });
      } else if (session?.user?.otpAccess) {
        await resendOtpApi({ email: session?.user?.email as string });
      }
      setResend(false);
      toast.success("OTP sent successfully");
    } catch (error) {
      const err = error as AxiosError;
      const message =
        (err.response?.data as { error: { message: string } })?.error
          ?.message || "An unexpected error occurred.";
      if (message && typeof message == "string") toast.error(message);
    } finally {
      setIsResendLoading(false);
    }
  }

  return {
    handleSubmit,
    isPending,
    otp,
    setOtp,
    isLoading,
    resend,
    resendOtp,
    isResendLoading,
  };
};

export default useOtp;
