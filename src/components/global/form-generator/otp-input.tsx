"use client";
import React from "react";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";

interface Props {
  otpLength: number;
  setOtp: (otp: string[]) => void;
  otp: string[];
}

const slotClass =
  "h-14 flex-1 rounded-[4px] border border-field bg-field dark:bg-field text-foreground text-xl shadow-none first:rounded-l-[4px] last:rounded-r-[4px] data-[active=true]:border-primary/60 data-[active=true]:ring-0";

const OtpInput = ({ setOtp, otp, otpLength }: Props) => {
  return (
    <InputOTP
      value={otp.join("")}
      maxLength={otpLength}
      onChange={(e) => {
        const chars = e.split("");
        while (chars.length < otpLength) chars.push("");
        setOtp(chars);
      }}
      containerClassName="flex items-center gap-2 w-full"
    >
      {Array.from({ length: otpLength }).map((_, i) => (
        <InputOTPSlot key={i} index={i} className={slotClass} />
      ))}
    </InputOTP>
  );
};

export default OtpInput;
