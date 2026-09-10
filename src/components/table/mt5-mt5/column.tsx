"use client";
import { StatusDot } from "@/components/ui/status-dot";

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
import {
  TMT5ToMT5TransferHistoryItemApiResponse,
  TMT5DepositHistoryItemApiResponse,
} from "@/types/api.response";
import DepositForm from "@/components/forms/depositForm";
import { statusBadge } from "@/constants/curency";

// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = TMT5ToMT5TransferHistoryItemApiResponse & {
  rowNumber: number;
};

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div className="text-start">{row.index + 1}</div>,
  },
  {
    accessorKey: "transfer_id",
    header: "Transfer ID",

    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.original?.transfer_id);
        }}
        className="text-start"
      >
        {row.original?.transfer_id}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.getValue("amount"));
        }}
        className="text-start"
      >
        {row.getValue("amount")} USD
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusDot status={row.original?.status} size="md" />
    ),
  },
  {
    accessorKey: "destination_login",
    header: "Destination Login",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.getValue("destination_login"));
        }}
        className="text-start"
      >
        {row.getValue("destination_login")}
      </div>
    ),
  },
  {
    accessorKey: "source_login",
    header: "Source Login",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.getValue("source_login"));
        }}
        className="text-start"
      >
        {row.getValue("source_login")}
      </div>
    ),
  },
  {
    accessorKey: "source_deal_id",
    header: "Source Deal ID",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.getValue("source_deal_id"));
        }}
        className="text-start"
      >
        {row.getValue("source_deal_id")}
      </div>
    ),
  },
  {
    accessorKey: "destination_deal_id",
    header: "Destination Deal ID",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.getValue("destination_deal_id"));
        }}
        className="text-start"
      >
        {row.getValue("destination_deal_id")}
      </div>
    ),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.getValue("comment"));
        }}
        className="text-start"
      >
        {row.getValue("comment")}
      </div>
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
