"use client";
import React, { useState } from "react";
import { DataTable } from "../../global/data-table/serverSideTable";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";

import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { useWithdrawHistory } from "@/hooks/useWithdraw";
import { item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
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


interface Props { }

const WithdrawList = (props: Props) => {
  // Showcasing the use of search params cache in nested RSCs
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);
  const { withdrawHistory, isLoading, params, updateParams, total } = useWithdrawHistory();
  if (isLoading)
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (withdrawHistory) {
    const schemas = withdrawHistory as any;
    return <DataTable component={
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-2">
        <Select value={params.status_filter} onValueChange={(value) => updateParams("status_filter", value)}>
          <SelectTrigger 
            className="w-full md:w-[184px] px-4">
            <SelectValue placeholder="status" />
          </SelectTrigger>
          <SelectContent>
            {["all", "pending", "processing", "completed", "rejected"].map((type) => (
              <SelectItem key={type} value={type}>
                {type == "all" ? "All Status" : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={params.currency} onValueChange={(value) => updateParams("currency", value)}>
          <SelectTrigger 
            className="w-full md:w-[184px] px-4">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {[{ "id": "all", "label": "All Currencies", "value": "all", iconImage: "/logo.png" }, ...currencies].map((type) => (
              <SelectItem key={type.id} className="flex items-center gap-2" value={type.value}>
                <img src={type.iconImage} className="w-4 h-4" />
                {type.label}

              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={params.withdrawal_method} onValueChange={(value) => updateParams("withdrawal_method", value)}>
          <SelectTrigger 
            className="w-full md:w-[184px] px-4">
            <SelectValue className="capitalize" placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {["all", "bank", "crypto", "cash", "upi", "custom", "admin_withdrawal"].map((type) => (
              <SelectItem className="capitalize" key={type} value={type}>
                {type === "all"
                  ? "All Methods"
                  : type === "admin_withdrawal"
                  ? "Admin Withdrawal"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
          router.push("/root/funds/withdraw");
        }}
        isLoading={false}
        className="mt-2 w-min"
        text="Withdraw"
      />
    </motion.div  >
  );
};

export default WithdrawList;
