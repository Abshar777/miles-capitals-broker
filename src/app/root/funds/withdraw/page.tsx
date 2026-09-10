"use client";
import { container_variants, item_variants } from "@/constants/framer-motion";
import React from "react";
import { motion } from "framer-motion";
import { useGetMt5Balance } from "@/hooks/useMt5";
import WithdrawCard from "@/components/page-sections/funds/withdrawCard";
import WithdrawHistory from "@/components/page-sections/funds/withdrawHistory";

const fmt = (n?: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n || 0);

const page = () => {
  const { balance } = useGetMt5Balance();

  return (
    <motion.div
      variants={container_variants}
      initial="hidden"
      animate="visible"
      className="grid relative md:grid-cols-3 gap-6"
    >
      <motion.div variants={item_variants} className="md:col-span-3 flex flex-wrap gap-x-10 gap-y-2">
        {[
          { label: "Available", value: balance?.available_balance },
          { label: "On Hold", value: balance?.hold_balance },
          { label: "Total", value: balance?.total_balance },
          { label: "Withdrawn", value: balance?.total_completed_withdrawals },
        ].map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="text-[15px] leading-6 text-muted-foreground">{s.label}</span>
            <span className="text-[18px] leading-6 text-foreground">
              {fmt(s.value)} {balance?.currency || "USD"}
            </span>
          </div>
        ))}
      </motion.div>
      <WithdrawCard />
      <WithdrawHistory />
    </motion.div>
  );
};

export default page;
