"use client";
import React, { useState } from "react";
import { DataTable } from "../../global/data-table/serverSideTable";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
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
import { statusBadge } from "@/constants/curency";
import TableDatePicker from "@/components/global/date-picker";
import { DateRange } from "react-day-picker";
import { FaServer } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { useMt5ToWalletTableHistory } from "@/hooks/useMt5ToWalletTableHistory";

const Mt5ToWalletList = () => {
  const router = useRouter();
  const { data, isLoading, params, updateParams, total } = useMt5ToWalletTableHistory();
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);

  if (isLoading)
    return <DataTableSkeleton columnCount={7} rowCount={8} filterCount={2} />;

  if (data) {
    return (
      <DataTable
        component={
          <div className="grid grid-cols-2 md:flex items-center gap-2">
            <Select
              value={params.status_filter}
              onValueChange={(value) => updateParams("status_filter", value)}
            >
              <SelectTrigger
                
                className="w-full md:w-[184px] px-4"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {["all", "pending", "completed", "failed"].map((type) => (
                  <SelectItem key={type} value={type}>
                    
                    {type === "all" ? "All Status" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative col-span-2 text-sm">
              <FaServer className="absolute text-sm left-2 top-1/2 text-muted-foreground -translate-y-1/2" />
              <Input
                placeholder="MT5 Login"
                value={params.mt5_login}
                onChange={(e) => updateParams("mt5_login", e.target.value)}
                className="md:w-fit w-full pl-7 text-sm h-8 rounded-md bg-muted-foreground/5"
              />
            </div>

            <TableDatePicker
              onChangeFrom={(e) => updateParams("date_from", e)}
              onChangeTo={(e) => updateParams("date_to", e)}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        }
        totalRows={total}
        search="transfer_id"
        data={data as any}
        columns={columns}
      />
    );
  }

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center"
      variants={item_variants}
    >
      <img src="/svgs/nothing.svg" className="w-[300px] grayscale opacity-50" />
      <h1 className="text-lg font-semibold">No transactions found</h1>
      <p className="text-sm text-white/50">No MT5 to wallet transfers yet</p>
      <AnimatedButton
        size="md"
        onClick={() => router.push("/root/funds")}
        isLoading={false}
        className="mt-2 w-min"
        text="Transfer"
      />
    </motion.div>
  );
};

export default Mt5ToWalletList;
