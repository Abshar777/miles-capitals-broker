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
import {
  TMT5ToMT5TransferHistoryItemApiResponse,
  TMT5DepositHistoryItemApiResponse,
  TWalletTransferHistory,
} from "@/types/api.response";
import DepositForm from "@/components/forms/depositForm";
import { statusBadge } from "@/constants/curency";
import { TIBWalletTransactionApiResponse } from "@/types/IIB";

// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = TIBWalletTransactionApiResponse['transactions'][0] & {
  rowNumber: number;
};

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="text-start">{row.original?.id}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-start">
        {String(row.original?.amount).replace("-", "")} {row.original?.currency}
      </div>
    ),
  },
  {
    accessorKey: "transaction_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={statusBadge[row.original?.transaction_type]} className="text-xs">
        {row.original?.reference_type}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Details",
    cell: ({ row }) => (
      <div className="text-start max-w-[250px] truncate">
        {row.original?.description.startsWith("Commission from trade") ? row.original?.description.split("Commission from trade")[1].split('-')[0].trim() : row.original?.description}
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
];
