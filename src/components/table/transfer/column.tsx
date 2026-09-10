"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
// import BrandEditForm from "@/components/forms/brandEditForm";
// import { useDltBrand } from "@/hooks/useBrand";
import { Button, buttonVariants } from "@/components/ui/button";
import { ClockIcon, Copy, PlusIcon, UserIcon } from "lucide-react";

import { ImEmbed2 } from "react-icons/im";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { cn, formatIST } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { TMT5DepositHistoryItemApiResponse } from "@/types/api.response";
import DepositForm from "@/components/forms/depositForm";
import { statusBadge } from "@/constants/curency";

// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = TMT5DepositHistoryItemApiResponse & {
  rowNumber: number;
};

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div className="text-start">{row.index + 1}</div>,
  },
  {
    accessorKey: "withdrawal_id",
    header: "Transfer ID",

    cell: ({ row }) => <div onClick={() => {
      navigator.clipboard.writeText(row.original?.withdrawal_id);
    }} className="text-start">{row.original?.withdrawal_id}</div>,
  },
  {
    accessorKey: "deposit_amount",
    header: "Amount",
    cell: ({ row }) => <div onClick={() => {
      navigator.clipboard.writeText(row.getValue("deposit_amount"));
    }} className="text-start">{row.getValue("deposit_amount")} {row.original?.currency}</div>,
  },
  {
    accessorKey: "mt5_login",
    header: "Mt5 Login",
    cell: ({ row }) => <div onClick={() => {
      navigator.clipboard.writeText(row.getValue("mt5_login"));
    }} className="text-start">{row.getValue("mt5_login")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusDot status={row.original?.status} size="md" />
    ),
  },

  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-start">
        {formatIST(row.original?.created_at, { day: "2-digit", month: "short", year: "numeric" })}
      </div>
    ),
  },
  {
    accessorKey: "completed_at",
    header: "Completed At",
    cell: ({ row }) => (
      <div className="text-start">
        {formatIST(row.original?.completed_at, { day: "2-digit", month: "short", year: "numeric" })}
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
