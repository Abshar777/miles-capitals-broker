"use client";

import RefredFrinds from "@/components/page-sections/ib/overview/friends";
import IBApplyComp from "@/components/page-sections/ib/overview/ibApplyComp";
import IBApplyPendingComp from "@/components/page-sections/ib/overview/ibApplyPendingComp";
import PlanBadge from "@/components/page-sections/ib/overview/planBadge";
import RefralLinkSection from "@/components/page-sections/ib/overview/refralLinkSection";
import TotalClientCount from "@/components/page-sections/ib/overview/totalClientCount";
import PageContainer from "@/components/providers/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { useGetIbStatus, useGetMyClients, useGetMyIBPlan } from "@/hooks/useIB";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React, { useEffect, useState } from "react";
import IbStatus from "../status/ibStatus";
import IbWalletBalanceCards from "./IbBalance";

const Overview = () => {
  const { data, isLoading, isError } = useGetMyIBPlan();

  const {
    data: myClients,
    isLoading: myClientsLoading,
    isFetching: myClientsFetching,
    isError: myClientsError,
    refetch: myClientsRefetch,
    page, setPage,
    search, setSearch,
    totalPages, totalCount,
  } = useGetMyClients();

  const clientProps = {
    data: myClients,
    isLoading: myClientsLoading,
    isFetching: myClientsFetching,
    isError: myClientsError,
    refetch: myClientsRefetch,
    page, setPage,
    search, setSearch,
    totalPages, totalCount,
  };

  return (
    <>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="grid relative mb-4 md:grid-cols-3 gap-4"
      >
        <div className="md:col-span-2 w-full flex flex-col gap-2">
          <PlanBadge isLoading={isLoading} data={data} />
          <div className="md:block hidden">
            <RefredFrinds {...clientProps} />
          </div>
        </div>

        <div className="md:col-span-1 w-full flex flex-col gap-2">
          <IbWalletBalanceCards />
          <TotalClientCount
            totalDirectClients={myClients?.summary?.direct_clients_count}
            totalDescendantsClients={myClients?.summary?.total_descendants_count}
            isLoading={myClientsLoading}
          />
          <RefralLinkSection
            referralLink={data?.unique_url}
            isLoading={isLoading}
            code={data?.unique_ref_code}
          />
          <div className="md:hidden block">
            <RefredFrinds {...clientProps} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Overview;
