"use client";

import IBApplyComp from "@/components/page-sections/ib/overview/ibApplyComp";
import IBApplyPendingComp from "@/components/page-sections/ib/overview/ibApplyPendingComp";
import { item_variants } from "@/constants/framer-motion";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import React from "react";

const IbStatus = ({ ibStatus, ibStatusLoading }: { ibStatus: any; ibStatusLoading: boolean }) => {
  return (
    <>
      {ibStatusLoading && (
        <div className="flex min-h-[240px] items-center justify-center h-full w-full">
          <Spinner color="primary" size="lg" />
        </div>
      )}

      {!ibStatusLoading && ibStatus && !ibStatus.is_ib && (ibStatus.status === null || ibStatus.status === "REJECTED") && (
        <motion.div variants={item_variants}>
          <IBApplyComp />
        </motion.div>
      )}

      {!ibStatusLoading && !ibStatus && (
        <div className="h-[240px] rounded-[4px] border border-border flex flex-col items-center justify-center gap-2 text-center px-6">
          <span className="text-[18px] leading-6 font-medium text-foreground">IB status unavailable</span>
          <span className="text-[15px] leading-6 text-muted-foreground">We could not load your IB status. Please refresh or try again later.</span>
        </div>
      )}

      {!ibStatusLoading && ibStatus && !ibStatus.is_ib && ibStatus.status === "PENDING" && (
        <motion.div variants={item_variants}>
          <IBApplyPendingComp />
        </motion.div>
      )}
    </>
  );
};

export default IbStatus;
