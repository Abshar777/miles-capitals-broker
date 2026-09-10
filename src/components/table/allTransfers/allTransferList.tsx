"use client";
import React, { useState } from "react";
import { DataTable } from "../../global/data-table/serverSideTable";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";

import { useDepositeHistory } from "@/hooks/useDeposit";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { useTransferHistory } from "@/hooks/useTransfer";
import { motion } from "framer-motion";
import { item_variants } from "@/constants/framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { currencies, currencyImages, statusBadge } from "@/constants/curency";
import TableDatePicker from "@/components/global/date-picker";
import { DateRange } from "react-day-picker";
import { FaServer } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { useAllTransferHistory } from "@/hooks/useAllTransfers";
import { transferTypes } from "@/constants/transfers";


interface Props { }

const AllTransferList = (props: Props) => {
  // Showcasing the use of search params cache in nested RSCs
  const router = useRouter();
  const { data, isLoading, params, updateParams, total } = useAllTransferHistory();
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);

  if (isLoading)
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (data) {
    const schemas = data as any;
    return <DataTable component={
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-2">
        <Select value={params.status_filter} onValueChange={(value) => updateParams("status_filter", value)}>
          <SelectTrigger 
            className="w-full md:w-[184px] px-4">
            <SelectValue placeholder="status" />
          </SelectTrigger>
          <SelectContent>
            {["all", "pending", "completed", "failed"].map((type) => (
              <SelectItem key={type} value={type}>
                {type == "all" ? "All Status" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={params.transfer_type} onValueChange={(value) => updateParams("transfer_type", value)}>
          <SelectTrigger 
            className="w-full md:w-[184px] px-4">
            <SelectValue placeholder="Transfer Type" />
          </SelectTrigger>
          <SelectContent>
            {transferTypes.map((type) => (
              <SelectItem key={type} className="flex items-center gap-2" value={type}>
                {type.replace("_", " ").toUpperCase()}

              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative col-span-2   text-sm">
          <FaServer className="absolute text-sm left-2 top-1/2 text-muted-foreground -translate-y-1/2" />
          <Input
            placeholder={`Mt5 Login`}
            value={params.mt5_login}
            onChange={(e) => updateParams("mt5_login", e.target.value)}
            className="w-full md:w-[184px] pl-10 h-12"
          />
        </div>

        <TableDatePicker onChangeFrom={(e => {
          updateParams("date_from", e)
        })} onChangeTo={(e => {
          updateParams("date_to", e)
        })} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
    } totalRows={total} search={"withdrawal_id"} data={schemas} columns={columns} />;
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

export default AllTransferList;
