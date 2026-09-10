"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { statusBadge } from "@/constants/curency";
import { formatIST } from "@/lib/utils";
import { IAllTransfersData } from "@/types/IAllTransfers";

export type Mt5ToWalletColumn = IAllTransfersData["transfers"][0] & {
  rowNumber: number;
};

export const columns: ColumnDef<Mt5ToWalletColumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div className="text-start">{row.index + 1}</div>,
  },
  {
    accessorKey: "id",
    header: "Transfer ID",
    cell: ({ row }) => (
      <div
        onClick={() => navigator.clipboard.writeText(row.original.id)}
        className="cursor-pointer hover:underline text-start"
      >
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "from_account",
    header: "MT5 Account",
    cell: ({ row }) => (
      <div
        onClick={() => navigator.clipboard.writeText(row.original.from_account ?? "")}
        className="cursor-pointer hover:underline text-start"
      >
        {row.original.from_account}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-medium text-start">
        {row.original.amount} {row.original.currency}
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
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div className="text-start text-muted-foreground whitespace-nowrap">
        {formatIST(row.original.created_at)}
      </div>
    ),
  },
  {
    accessorKey: "completed_at",
    header: "Completed At",
    cell: ({ row }) => (
      <div className="text-start text-muted-foreground whitespace-nowrap">
        {row.original.completed_at ? formatIST(row.original.completed_at) : "—"}
      </div>
    ),
  },
];
