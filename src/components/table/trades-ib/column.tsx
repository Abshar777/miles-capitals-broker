"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
// import BrandEditForm from "@/components/forms/brandEditForm";
// import { useDltBrand } from "@/hooks/useBrand";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowUpRight,
  ClockIcon,
  Copy,
  PlusIcon,
  UserIcon,
} from "lucide-react";

import { ImEmbed2 } from "react-icons/im";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { cn, copyToClipboard, formatIST } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import {
  TIBSummaryApiResponse,
  TMT5DepositHistoryItemApiResponse,
} from "@/types/api.response";
import DepositForm from "@/components/forms/depositForm";
import { statusBadge } from "@/constants/curency";

// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = TIBSummaryApiResponse["trades"][0] & {
  rowNumber: number;
};

export const columns: ColumnDef<Cloumn>[] = [
  // {
  //   accessorKey: "rowNumber",
  //   header: "#",
  //   cell: ({ row }) => <div className="text-start">{row.index + 1}</div>,
  // },
  {
    accessorKey: "symbol",
    header: "ID / Symbol",

    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight">
          {row.original?.symbol}
        </span>
        <span className="text-xs text-muted-foreground">
          Ticket: {row.original?.trade_ticket_id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "trade_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant={
          statusBadge[
            row.original?.trade_type === "buy" ? "success" : "failed"
          ] as any
        }
      >
        {row.original?.trade_type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Volume",
    cell: ({ row }) => (
      <div className="text-start font-mono">{row.original?.volume}</div>
    ),
  },
  {
    accessorKey: "Type",
    header: "Open Price",
    cell: ({ row }) => (
      <div className="text-start font-mono">
        {parseFloat(row.original?.open_price).toFixed(5)}
      </div>
    ),
  },
  {
    accessorKey: "Type",
    header: "Net Profit",
    cell: ({ row }) => {
      const isProfit = parseFloat(row.original?.net_profit) >= 0;
      return (
        <div
          className={`flex items-center gap-1 font-semibold text-sm ${
            isProfit
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isProfit ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          ${parseFloat(row.original?.net_profit).toFixed(2)}
        </div>
      );
    },
  },

  {
    accessorKey: "open_time",
    header: "Time",
    cell: ({ row }) => (
      <div className="text-start">
        {formatIST(row.original?.open_time)}
      </div>
    ),
  },

  // {
  //   accessorKey: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     return (
  //       <CellAction
  //         updateForm={<DepositForm />}
  //         id={row.original.deposit_id}
  //         deletFn={() => {}}
  //         dltLoading={false}
  //         isSuccess={false}
  //       />
  //     );
  //   },
  // },
];
