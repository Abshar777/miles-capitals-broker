"use client";
import PageContainer from "@/components/providers/page-container";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { container_variants, item_variants } from "@/constants/framer-motion";
import DepositTransactionsCard from "@/components/page-sections/transactions/depositTransactionsCard";
import WithdrawTransactionsCard from "@/components/page-sections/transactions/withdrawTransactionsCard";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import TransferTransactionsCard from "@/components/page-sections/transactions/trasnferTransactionsCard";
import InternalTransactionsCard from "@/components/page-sections/transactions/internalTransactionsCard";
import AllTransactionsCard from "@/components/page-sections/transactions/allTransactionsCard";
import Mt5ToWalletTransactionsCard from "@/components/page-sections/transactions/mt5ToWalletTransactionsCard";

const TABS = [
  { value: "all-transfers", label: "All" },
  { value: "deposit", label: "Deposits" },
  { value: "withdraw", label: "Withdrawals" },
  { value: "transfer", label: "Transfer" },
  { value: "mt5-wallet", label: "MT5 to Wallet" },
  { value: "internal-transfer", label: "Internal Transfer" },
];

/** Reference Transactions page: underline tabs, then the filtered table. */
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || "";
  const tab = searchParams.get("tab") || "all-transfers";
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    document.title = "Transactions | MILES CAPITAL";
    const query = accountId.trim() ? `&accountId=${accountId}` : "";
    if (activeTab !== tab) router.push(`/root/transactions?tab=${activeTab}${query}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-6 w-full"
      >
        <motion.div variants={item_variants}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              {TABS.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {activeTab === "all-transfers" && <AllTransactionsCard />}
        {activeTab === "deposit" && <DepositTransactionsCard />}
        {activeTab === "withdraw" && <WithdrawTransactionsCard />}
        {activeTab === "transfer" && <TransferTransactionsCard />}
        {activeTab === "mt5-wallet" && <Mt5ToWalletTransactionsCard />}
        {activeTab === "internal-transfer" && <InternalTransactionsCard />}
      </motion.div>
    </PageContainer>
  );
};

export default page;
