import React from "react";
import AuthCard from "./AuthCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading placeholders for the /auth pages.
 *
 * These reuse the real `AuthCard`, so the card width, padding, border and gap always match
 * the loaded page. The individual bars mirror the reference metrics used by the live
 * components: label 24px, field 56px, primary button 56px, footer line 16px, 4px radius,
 * filled with `--field` so they read as empty inputs rather than grey blocks.
 */
const bar = "rounded-[4px] bg-field";

export const SkTitle = ({ center = false }: { center?: boolean }) => (
  <Skeleton className={cn(bar, "h-8 w-[45%]", center && "mx-auto")} />
);

export const SkSubtitle = ({ center = false, lines = 1 }: { center?: boolean; lines?: number }) => (
  <div className={cn("flex flex-col gap-1 -mt-2 mb-1", center && "items-center")}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(bar, "h-[18px]", i === lines - 1 && lines > 1 ? "w-[70%]" : "w-[55%]")}
      />
    ))}
  </div>
);

/** Label (24px) + 8px gap + 56px field, matching AuthField. */
export const SkField = ({ labelled = true }: { labelled?: boolean }) => (
  <div className="flex flex-col gap-2">
    {labelled && <Skeleton className={cn(bar, "h-6 w-24")} />}
    <Skeleton className={cn(bar, "h-14 w-full")} />
  </div>
);

/** Dial-code select + number input, matching AuthPhone. */
export const SkPhoneField = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className={cn(bar, "h-6 w-28")} />
    <div className="flex gap-2">
      <Skeleton className={cn(bar, "h-14 w-[122px] shrink-0")} />
      <Skeleton className={cn(bar, "h-14 flex-1")} />
    </div>
  </div>
);

/** Six 56px OTP boxes, matching the input-otp row. */
export const SkOtpRow = () => (
  <div className="flex items-center gap-2 w-full">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className={cn(bar, "h-14 flex-1")} />
    ))}
  </div>
);

/** Right-aligned "Forgot password?" link. */
export const SkInlineLink = ({ align = "right" }: { align?: "left" | "right" }) => (
  <div className={cn("flex", align === "right" ? "justify-end" : "justify-start")}>
    <Skeleton className={cn(bar, "h-6 w-28")} />
  </div>
);

/** 24px checkbox + label, matching AuthCheckbox. */
export const SkCheckbox = () => (
  <div className="flex items-center gap-2">
    <Skeleton className={cn(bar, "size-6 shrink-0")} />
    <Skeleton className={cn(bar, "h-6 w-56")} />
  </div>
);

export const SkButton = ({ full = false }: { full?: boolean }) => (
  <Skeleton className={cn(bar, "h-14 mt-2", full ? "w-full" : "w-32")} />
);

/** "Don't have an account? Sign up" footer line. */
export const SkFooterLine = () => <Skeleton className={cn(bar, "h-4 w-[60%] mx-auto mt-2")} />;

/** "← Back" link rendered under the card. */
export const SkBackLink = () => <Skeleton className={cn(bar, "h-6 w-20")} />;

/** Card wrapper — same component the real pages use. */
export const AuthSkeletonCard = ({
  children,
  withBack = false,
}: {
  children: React.ReactNode;
  withBack?: boolean;
}) => <AuthCard after={withBack ? <SkBackLink /> : undefined}>{children}</AuthCard>;

export default AuthSkeletonCard;
