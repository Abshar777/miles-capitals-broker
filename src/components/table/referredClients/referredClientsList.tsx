"use client";

import React, { useState } from "react";
import { DataTable } from "../../global/data-table/serverSideTable";
import { columns } from "./column";
import { DataTableSkeleton } from "../../global/table/data-table-skeleton";
import { useReferredClients } from "@/hooks/useIB";
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
import { HiMiniUsers } from "react-icons/hi2";

const ReferredClientsList = () => {
  const router = useRouter();
  const { data, isLoading, params, updateParams, total } = useReferredClients();
  const [selectedDate, setSelectedDate] = useState<DateRange | null>(null);

  if (isLoading)
    return <DataTableSkeleton columnCount={8} rowCount={8} filterCount={2} />;

  if (data) {
    const schemas = data as any;
    return (
      <DataTable
        component={
          <div className="grid grid-cols-2 md:flex items-center gap-2">
            <Select
              value={params.is_ib}
              onValueChange={(value) => updateParams("is_ib", value)}
            >
              <SelectTrigger
                
                className="md:w-fit col-span-2 w-full py-0 bg-muted-foreground/5 rounded-md text-sm"
              >
                <SelectValue placeholder="Client type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "all", label: "All Clients" },
                  { value: "ib", label: "IB Only" },
                  { value: "client", label: "Non-IB Only" },
                ].map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    <span className="flex items-center gap-2">
                      <HiMiniUsers className="w-3 h-3" />
                      {label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TableDatePicker
              onChangeFrom={(e) => updateParams("date_from", e)}
              onChangeTo={(e) => updateParams("date_to", e)}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        }
        totalRows={total}
        data={schemas}
        columns={columns}
      />
    );
  }

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center"
      variants={item_variants}
    >
      <img
        src={"/svgs/nothing.svg"}
        className="w-[300px] grayscale opacity-50"
      />
      <h1 className="text-lg font-semibold">No referred clients found</h1>
      <p className="text-sm text-white/50">
        Share your referral link to get started
      </p>
      <AnimatedButton
        size="md"
        onClick={() => router.push("/root/ib-room?tab=overview")}
        isLoading={false}
        className="mt-2 w-min"
        text="Go to Overview"
      />
    </motion.div>
  );
};

export default ReferredClientsList;
