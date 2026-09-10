"use client";
import React, { useState } from "react";
import { DataTable } from "../../global/data-table/serverSideTable";
import { useDepositColumns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";

import { useDepositeHistory } from "@/hooks/useDeposit";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { currencies, currencyImages, statusBadge } from "@/constants/curency";
import TableDatePicker from "@/components/global/date-picker";
import { DateRange } from "react-day-picker";

interface Props { }

const DepositList = (props: Props) => {
  // Showcasing the use of search params cache in nested RSCs
  const router = useRouter();
  const { depositHistory, isLoading, params, updateParams, total } = useDepositeHistory();
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);
  const { columns, DetailsModal } = useDepositColumns()
  if (isLoading)
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (depositHistory) {
    const schemas = depositHistory as any;
    return (<>

      {DetailsModal}
      <DataTable component={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-2">
          <Select value={params.status} onValueChange={(value) => updateParams("status", value)}>
            <SelectTrigger 
              className="w-full md:w-[184px] px-4">
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent>
              {["all", "pending", "approved", "rejected"].map((type) => (
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
          <Select value={params.payment_mode} onValueChange={(value) => updateParams("payment_mode", value)}>
            <SelectTrigger 
              className="w-full md:w-[184px] px-4">
              <SelectValue className="capitalize" placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {["all", "bank", "crypto", "admin_credit"].map((type) => (
                <SelectItem className="capitalize" key={type} value={type}>

                  {type.replace("admin_", "") == "all" ? "All Methods" : type.replace("admin_", "")}

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
      } totalRows={total} search={"deposit_id"} data={schemas} columns={columns} /></>);
  }
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground mb-3"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="10" rx="1.5" /><path d="M2 7h12" /></svg></span>
      <h1 className="text-[18px] leading-6 font-medium text-foreground">No transaction found</h1>
      
      <AnimatedButton
        size="md"
        onClick={() => {
          router.push("/root/funds/deposit");
        }}
        isLoading={false}
        className="mt-2 w-min"
        text="Deposit"
      />
    </div>
  );
};

export default DepositList;
