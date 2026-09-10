"use client";

import Overview from "@/components/page-sections/ib/overview/overview";
import IbStatus from "@/components/page-sections/ib/status/ibStatus";
import TradesIbRoom from "@/components/page-sections/ib/trades/trades-ibRoom";
import PageContainer from "@/components/providers/page-container";
import IBCommmisionList from "@/components/table/ibCommission/ibCommissionList";
import IBTransferList from "@/components/table/ibTransferList/ibTransferList";
import ReferredClientsList from "@/components/table/referredClients/referredClientsList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { useGetIbStatus } from "@/hooks/useIB";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React, { useEffect, useState } from "react";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "clients", label: "Clients" },
  { value: "commisions", label: "Commissions" },
  { value: "transactions", label: "Transactions" },
];

/** Reference IB Room: underline tabs, then the selected report. */
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    document.title = "IB Room | MILES CAPITAL";
    if (activeTab !== tab) router.push(`/root/ib-room?tab=${activeTab}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const { data: ibStatus, isLoading: ibStatusLoading } = useGetIbStatus();
  const approved = ibStatus?.is_ib && ibStatus.status === "APPROVED";

  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-6 w-full"
      >
        {approved && (
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
        )}

        <IbStatus ibStatus={ibStatus} ibStatusLoading={ibStatusLoading} />
        {approved && (
          <>
            {activeTab === "overview" && <Overview />}
            {activeTab === "clients" && <ReferredClientsList />}
            {activeTab === "trades" && <TradesIbRoom />}
            {activeTab === "transactions" && <IBTransferList />}
            {activeTab === "commisions" && <IBCommmisionList />}
          </>
        )}
      </motion.div>
    </PageContainer>
  );
};

export default Page;
