"use client";
import React from "react";
import { motion } from "framer-motion";
import PageContainer from "@/components/providers/page-container";
import { container_variants } from "@/constants/framer-motion";
import VerificationBadge from "@/components/page-sections/dashboard/verification-badge";
import Portfolio from "@/components/page-sections/dashboard/Portfolio";
import LastTransactions from "@/components/page-sections/dashboard/lastTransactions";
import TradingAccounts from "@/components/page-sections/dashboard/TradingAccounts";
import { useAllTransactionHistory } from "@/hooks/useWallet";

/** Reference dashboard: verification banner → Portfolio | Last Transactions → Trading Accounts. */
const page = () => {
  const { data: allTx, isLoading: isAllTxLoading } = useAllTransactionHistory(4);

  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-6 w-full"
      >
        <VerificationBadge />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6">
          <Portfolio />
          <LastTransactions data={allTx} isLoading={isAllTxLoading} />
        </div>

        <TradingAccounts />
      </motion.div>
    </PageContainer>
  );
};

export default page;
