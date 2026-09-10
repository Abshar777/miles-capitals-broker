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
  TWalletTransferHistory,
} from "@/types/api.response";
import DepositForm from "@/components/forms/depositForm";
import { statusBadge } from "@/constants/curency";

// import { useDeleteBranch } from "@/hooks/useBranch";
  export type Cloumn = TWalletTransferHistory & {
  rowNumber: number;
};

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div className="text-start cursor-pointer">{row.index + 1}</div>,
  },
  {
    accessorKey: "transfer_id",
    header: "Transfer ID",

    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.original?.transfer_id);
        }}
        className="text-start cursor-pointer"
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
        className="text-start cursor-pointer"
      >
        {row.getValue("amount")} {row.original?.currency}
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
    accessorKey: "from_user_id",
    header: "From User ID",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.original?.from_user_id);
        }}
        className="text-start cursor-pointer"
      >
        {row.original?.from_user_id}
      </div>
    ),
  },
  {
    accessorKey: "from_user_name",
    header: "From User Name",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.original?.from_user_name);
        }}
        className="text-start cursor-pointer"
      >
        {row.original?.from_user_name}
      </div>
    ),
  },
  {
    accessorKey: "to_user_id",
    header: "To User ID",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.original?.to_user_id);
        }}
        className="text-start cursor-pointer"
      >
        {row.original?.to_user_id}
      </div>
    ),
  },

  {
    accessorKey: "to_user_name",
    header: "To User Name",
    cell: ({ row }) => (
      <div
        onClick={() => {
          navigator.clipboard.writeText(row.original?.to_user_name);
        }}
        className="text-start cursor-pointer"
      >
        {row.original?.to_user_name}
      </div>
    ),
  },

  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-start cursor-pointer">
        {formatIST(row.original?.created_at)}
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
