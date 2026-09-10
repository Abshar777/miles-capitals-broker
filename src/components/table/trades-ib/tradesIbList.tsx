"use client";
import React from "react";
import { DataTable } from "../../global/data-table";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";

import { useDepositeHistory } from "@/hooks/useDeposit";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { useTransferHistory } from "@/hooks/useTransfer";
import { motion } from "framer-motion";
import { item_variants } from "@/constants/framer-motion";
import { TIBSummaryApiResponse } from "@/types/api.response";

interface Props {
  trades: TIBSummaryApiResponse['trades'];
  isLoading: boolean
}

const TradesIbRoomList = ({ trades = [], isLoading }: Props) => {
  // Showcasing the use of search params cache in nested RSCs
  const router = useRouter();


  if (isLoading)
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (trades && trades?.length > 0) {
    const schemas = trades as any;
    return <DataTable search={"mt5_account_id"} data={schemas} columns={columns} />;
  }
  return (
    <motion.div className="w-full h-full flex flex-col items-center justify-center" variants={item_variants}>
      <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground mb-3"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="10" rx="1.5" /><path d="M2 7h12" /></svg></span>
      <h1 className="text-[18px] leading-6 font-medium text-foreground">No transaction found</h1>
      
      <AnimatedButton
        size="md"
        onClick={() => {
          router.push("/root/funds");
        }}
        isLoading={false}
        className="mt-2 w-min"
        text="Transfer"
      />
    </motion.div>
  );
};

export default TradesIbRoomList;
