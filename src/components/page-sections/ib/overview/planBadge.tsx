"use client";
import { Icon } from "@/components/ui/icon";
import { item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TMyRefralLinkApiResponse } from "@/types/api.response";
import { formatIST } from "@/lib/utils";

/** Reference plan selector look: label above a 56px field-style box with the plan name. */
const PlanBadge = ({ isLoading, data }: { isLoading: boolean; data: TMyRefralLinkApiResponse | null }) => {
  if (isLoading) {
    return (
      <motion.div variants={item_variants} className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16 bg-field rounded-[4px]" />
        <Skeleton className="h-14 w-full max-w-[326px] bg-field rounded-[4px]" />
      </motion.div>
    );
  }
  if (!data) return null;

  return (
    <motion.div variants={item_variants} className="flex flex-col gap-2">
      <span className="text-[15px] leading-6 text-muted-foreground">Plan</span>
      <div className="flex h-14 w-full max-w-[326px] items-center justify-between rounded-[4px] bg-field px-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] leading-5 text-foreground truncate">{data.plan_name}</span>
          {data.approved_at && (
            <span className="text-[12px] leading-4 text-muted-foreground">
              Approved {formatIST(data.approved_at, { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
        <Icon name="dropdown-16" size={16} className="text-muted-foreground/40 shrink-0" />
      </div>
    </motion.div>
  );
};

export default PlanBadge;
