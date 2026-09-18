"use client";
import { container_variants, item_variants } from "@/constants/framer-motion";
import React from "react";
import { motion } from "framer-motion";
import { useGetMt5Balance } from "@/hooks/useMt5";
import WithdrawCard from "@/components/page-sections/funds/withdrawCard";
import WithdrawHistory from "@/components/page-sections/funds/withdrawHistory";
import SummaryCard from "@/components/ui/stat-card";
import { Icon } from "@/components/ui/icon";

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
      <motion.div
        variants={item_variants}
        className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Available", value: balance?.available_balance, icon: "wallet-16" },
          { label: "On Hold", value: balance?.hold_balance, icon: "lock-16" },
          { label: "Total", value: balance?.total_balance, icon: "finance-16" },
          { label: "Withdrawn", value: balance?.total_completed_withdrawals, icon: "history-backward-16" },
        ].map((s) => (
          <SummaryCard
            key={s.label}
            title={s.label}
            value={`${fmt(s.value)} ${balance?.currency || "USD"}`}
            icon={<Icon name={s.icon} />}
          />
        ))}
      </motion.div>
      <WithdrawCard />
      <WithdrawHistory />
    </motion.div>
  );
};

export default page;
