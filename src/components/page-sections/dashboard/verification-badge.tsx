"use client";
import { Icon } from "@/components/ui/icon";
import { item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import React from "react";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "nextjs-toploader/app";

/** Ring progress "1/2" as on the reference banner. */
const RingProgress = ({ value, label }: { value: number; label: string }) => {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-[72px] shrink-0">
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--field)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--positive)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[15px] leading-6 text-foreground">
        {label}
      </span>
    </div>
  );
};

/**
 * Reference "Complete Your Identity Verification" banner:
 * 1px border, 4px radius, 16px 24px padding, ring + copy + gold "Verify Now".
 * Hidden once KYC is approved.
 */
const VerificationBadge = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <motion.div variants={item_variants} className="w-full rounded-[4px] border border-border px-6 py-4 flex items-center gap-6">
        <Skeleton className="size-[72px] rounded-full bg-field" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-1/3 bg-field rounded-[4px]" />
          <Skeleton className="h-4 w-2/3 bg-field rounded-[4px]" />
        </div>
        <Skeleton className="h-10 w-[148px] bg-field rounded-[4px]" />
      </motion.div>
    );
  }

  if (!user || user.kyc_status === "approved") return null;

  const submitted = user.kyc_status === "submitted";
  const step = submitted ? 2 : 1;

  return (
    <motion.div
      variants={item_variants}
      className="w-full rounded-[4px] border border-border px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
    >
      <RingProgress value={step * 50} label={`${step}/2`} />
      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] leading-6 font-medium text-foreground">
          {submitted ? "Verification Under Review" : "Complete Your Identity Verification"}
        </h2>
        <p className="text-[15px] leading-6 text-muted-foreground">
          {submitted
            ? "We are reviewing your documents. This usually takes less than a day."
            : "Unlock higher transaction limits, gain access to new payment methods, enable trading accounts"}
        </p>
        <p className="mt-1 flex items-center gap-1 text-[12px] leading-4 text-muted-foreground/40">
          <Icon name="clock-16" size={16} />
          Verification takes ~4 min
        </p>
      </div>
      {!submitted && (
        <button
          type="button"
          onClick={() => router.push("/root/verification")}
          className="h-10 shrink-0 rounded-[4px] bg-primary px-6 py-2 text-[13.33px] text-black outline outline-1 -outline-offset-1 outline-transparent hover:brightness-110 hover:outline-primary transition-[filter,outline-color] duration-150 ease-in-out inline-flex items-center gap-2"
        >
          Verify Now
        </button>
      )}
    </motion.div>
  );
};

export default VerificationBadge;
