"use client";
import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import type { TUserProfileApiResponse } from "@/types/api.response";
import { Skeleton } from "@/components/ui/skeleton";
import { type ReactNode } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { formatIST } from "@/lib/utils";
import { item_variants } from "@/constants/framer-motion";
import { StatusDot } from "@/components/ui/status-dot";

type Props = {
  user: TUserProfileApiResponse;
  isLoading: boolean;
};

/** Reference key/value row: grey label left (200px), white value right, 40px tall, hairline below. */
const Row = ({ label, value, copyValue }: { label: string; value: ReactNode; copyValue?: string }) => (
  <div className="grid grid-cols-[minmax(120px,200px)_1fr] items-center gap-4 min-h-[40px] py-2 border-b border-border">
    <span className="text-[12px] leading-4 text-muted-foreground">{label}</span>
    <span className="flex items-center gap-2 text-[15px] leading-6 text-foreground min-w-0">
      <span className="truncate">{value}</span>
      {copyValue && (
        <button
          type="button"
          aria-label={`Copy ${label}`}
          onClick={() => {
            navigator.clipboard.writeText(copyValue);
            toast.success(`${label} copied`);
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="copy-16" size={14} />
        </button>
      )}
    </span>
  </div>
);

const Section = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => (
  <motion.div variants={item_variants} className="flex flex-col">
    <div className="flex items-center gap-4 h-12 border-b border-border">
      <h3 className="text-[18px] leading-6 font-medium text-foreground">{title}</h3>
      {action}
    </div>
    <div className="flex flex-col">{children}</div>
  </motion.div>
);

const initialsOf = (u?: TUserProfileApiResponse) =>
  [u?.firstname, u?.lastname]
    .filter(Boolean)
    .map((p) => p![0].toUpperCase())
    .join("") || "U";

export function ProfileDetailsCard({ user, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_288px] gap-10">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-[4px] bg-field" />
          ))}
        </div>
        <Skeleton className="h-[144px] w-full rounded-[4px] bg-field" />
      </div>
    );
  }

  const memberSince = user?.created_at
    ? formatIST(user.created_at, { year: "numeric", month: "short", day: "2-digit" })
    : "-";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_288px] gap-10">
      <div className="flex flex-col gap-10 min-w-0">
        <Section title="Profile info">
          <Row label="First Name" value={user?.firstname || "-"} />
          <Row label="Last Name" value={user?.lastname || "-"} />
          <Row label="Member Since" value={memberSince} />
          <Row label="Wallet Balance" value={`${Number(user?.wallet_balance || 0).toFixed(2)} USD`} />
        </Section>

        <Section title="Account">
          <Row label="ID" value={user?.id || "-"} copyValue={user?.id} />
          <Row label="Email" value={user?.email || "-"} copyValue={user?.email} />
          <Row label="KYC Status" value={<StatusDot status={user?.kyc_status || "pending"} size="md" />} />
          <Row
            label="Verification"
            value={<StatusDot status={user?.is_verified ? "approved" : "pending"} size="md" />}
          />
        </Section>

        <Section title="Other">
          <Row label="Communication Language" value="English" />
        </Section>

        <Section title="Sign out">
          <p className="text-[15px] leading-6 text-muted-foreground py-4">
            Log out of your account on this device. You can sign back in at any time.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                toast.promise(signOut(), {
                  loading: "Logging out...",
                  success: "Logged out successfully",
                  error: "Failed to log out",
                })
              }
              className="h-12 inline-flex items-center gap-2 rounded-[4px] bg-field px-6 text-[15px] text-foreground outline outline-1 -outline-offset-1 outline-transparent hover:outline-primary/40 transition-[outline-color] duration-150 ease-in-out"
            >
              <Icon name="log-out-16" size={16} />
              Log out
            </button>
          </div>
        </Section>
      </div>

      <motion.div variants={item_variants} className="flex flex-col items-center gap-4 lg:pt-6">
        <div className="w-full aspect-square max-w-[288px] rounded-[4px] bg-field flex items-center justify-center text-[64px] leading-none font-medium text-foreground select-none">
          {initialsOf(user)}
        </div>
      </motion.div>
    </div>
  );
}
