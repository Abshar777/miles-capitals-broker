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
import { useMTransferHistory } from "@/hooks/useMt5ToMt5";
import { useWalletTransferHistory } from "@/hooks/useInternalTransfer";
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
import { FaCodeBranch, FaServer } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { useExportIbCommissions, useIbWalletCommissions, useIbWalletTransactions } from "@/hooks/useIbWallet";
import { RiStockFill } from "react-icons/ri";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


interface Props { }

const IBCommmisionList = (props: Props) => {
  // Showcasing the use of search params cache in nested RSCs
  const router = useRouter();
  const { data, isLoading, params, updateParams, total } = useIbWalletCommissions();
  const { exportToExcel, isExporting } = useExportIbCommissions();
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);

  if (isLoading)
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;

  if (data) {
    const schemas = data as any;
    return (
      <DataTable component={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-2">
          <Select value={params.status} onValueChange={(value) => updateParams("status", value)}>
            <SelectTrigger 
              className="md:w-fit col-span-2 w-full py-0  bg-muted-foreground/5 rounded-md text-sm">
              <SelectValue placeholder="type" />
            </SelectTrigger>
            <SelectContent>
              {[
                { value: "all", label: "All Status" },
                { value: "PAID", label: "Paid" },
                { value: "PENDING", label: "Pending" },
                { value: "FAILED", label: "Failed" },
              ].map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  <Badge className="p-2 rounded-full" variant={statusBadge[value.toLowerCase()] ?? "outline"}>
                  </Badge>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative col-span-2   text-sm">
            <FaCodeBranch className="absolute text-sm left-2 top-1/2 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder={`Level`}
              value={params.level}
              onChange={(e) => updateParams("level", e.target.value)}
              className="w-full md:w-[184px] pl-10 h-12"
            />
          </div>
          <div className="relative col-span-2   text-sm">
            <RiStockFill className="absolute text-sm left-2 top-1/2 text-muted-foreground -translate-y-1/2" />
            <Input
              placeholder={`Symbol`}
              value={params.symbol}
              onChange={(e) => updateParams("symbol", e.target.value)}
              className="w-full md:w-[184px] pl-10 h-12"
            />
          </div>


          <TableDatePicker onChangeFrom={(e => {
            updateParams("date_from", e)
          })} onChangeTo={(e => {
            updateParams("date_to", e)
          })} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <Button
            size="sm"
            variant="outline"
            disabled={isExporting}
            onClick={() => exportToExcel(params)}
            className="h-8 gap-1.5 text-xs bg-muted-foreground/5 border-muted-foreground/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          >
            {isExporting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            {isExporting ? "Exporting…" : "Export Excel"}
          </Button>
        </div>
      } totalRows={total} data={schemas} columns={columns} />
    );
  }
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center"
      variants={item_variants}
    >
      <img
        src={"/svgs/nothing.svg"}
        className="w-[300px] grayscale opacity-50 "
      />
      <h1 className="text-[18px] leading-6 font-medium text-foreground">No transaction found</h1>
      
      <AnimatedButton
        size="md"
        onClick={() => {
          router.push("/root/ib");
        }}
        isLoading={false}
        className="mt-2 w-min"
        text="Internal Transfer"
      />
    </motion.div>
  );
};

export default IBCommmisionList;
