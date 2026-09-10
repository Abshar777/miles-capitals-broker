"use client";
import { Icon } from "@/components/ui/icon";
import { item_variants } from "@/constants/framer-motion";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";

const Field = ({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[15px] leading-6 text-muted-foreground">{label}</span>
    <div className="flex h-12 items-center rounded-[4px] bg-field pl-4 pr-1">
      <span className="flex-1 min-w-0 truncate text-[15px] leading-6 text-foreground">{value || "-"}</span>
      <button
        type="button"
        aria-label={`Copy ${label}`}
        onClick={onCopy}
        className="size-10 inline-flex items-center justify-center rounded-[4px] text-muted-foreground hover:text-foreground"
      >
        <Icon name="copy-16" size={16} />
      </button>
    </div>
  </div>
);

/** Reference "Partner Link" card: title, link field with copy, code field with copy. */
const RefralLinkSection = ({
  referralLink,
  isLoading,
  code,
}: {
  referralLink: string;
  isLoading: boolean;
  code: string;
}) => {
  const url = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";
  const activeLink = useMemo(() => {
    if (referralLink && referralLink.includes("localhost")) {
      return referralLink.replace("http://localhost:3000", url + "/auth");
    }
    return referralLink || "";
  }, [referralLink, url]);

  return (
    <motion.div variants={item_variants} className="rounded-[4px] bg-card p-4 flex flex-col gap-4">
      <h3 className="text-[18px] leading-6 font-medium text-foreground">Partner Link</h3>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full bg-field rounded-[4px]" />
          <Skeleton className="h-12 w-full bg-field rounded-[4px]" />
        </div>
      ) : (
        <>
          <Field
            label="Link"
            value={activeLink}
            onCopy={() => {
              copyToClipboard(activeLink);
              toast.success("Referral link copied to clipboard");
            }}
          />
          <Field
            label="Referral code"
            value={code}
            onCopy={() => {
              copyToClipboard(code);
              toast.success("Referral code copied to clipboard");
            }}
          />
        </>
      )}
    </motion.div>
  );
};

export default RefralLinkSection;
