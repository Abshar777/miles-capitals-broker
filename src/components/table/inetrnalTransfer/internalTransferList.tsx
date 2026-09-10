"use client";
import React, { useState } from "react";
import { DataTable } from "../../global/data-table/serverSideTable";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { motion } from "framer-motion";
import { item_variants } from "@/constants/framer-motion";
import { useWalletTransferHistory } from "@/hooks/useInternalTransfer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { currencies, statusBadge } from "@/constants/curency";
import TableDatePicker from "@/components/global/date-picker";
import { DateRange } from "react-day-picker";


interface Props { }

const InternalTransferList = (props: Props) => {
  const router = useRouter();
  const { data, isLoading, params, updateParams, total } = useWalletTransferHistory();
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
              className="w-full md:w-[184px] px-4">
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent>
              {["all", "pending", "completed", "rejected",].map((type) => (
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



          <TableDatePicker onChangeFrom={(e => {
            updateParams("date_from", e)
          })} onChangeTo={(e => {
            updateParams("date_to", e)
          })} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
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
          router.push("/root/funds/internal-transfer");
        }}
        isLoading={false}
        className="mt-2 w-min"
        text="Internal Transfer"
      />
    </motion.div>
  );
};

export default InternalTransferList;
