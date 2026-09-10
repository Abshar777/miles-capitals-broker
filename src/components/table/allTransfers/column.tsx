"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { statusBadge } from "@/constants/curency";
import { cn, formatIST } from "@/lib/utils";
import { IAllTransfersData } from "@/types/IAllTransfers";
// Ensure this matches the interface we created earlier

// Using the nested 'transfers' type from your interface
export type TransferColumn = IAllTransfersData["transfers"][0] & {
  rowNumber: number;
};

// Helper to define colors for transfer types
const transferTypeBadge: Record<string, any> = {
  wallet_to_wallet: "warning",
  wallet_to_mt5: "default",
  mt5_to_wallet: "outline",
  mt5_to_mt5: "destructive",
};

export const columns: ColumnDef<TransferColumn>[] = [
  {
    accessorKey: "rowNumber",
    header: "#",
    cell: ({ row }) => <div className="text-start">{row.index + 1}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge variant={transferTypeBadge[type]} className={cn("whitespace-nowrap capitalize")}>
          {type.replace(/_/g, " ")}
        </Badge>
      );
    },
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
    header: "From",
    cell: ({ row }) => (
      <div
        onClick={() => navigator.clipboard.writeText(row.original.id)}
        className="cursor-pointer hover:underline text-start"
      >
        {row.original.from_account}
      </div>
    ),
  },
  {
    accessorKey: "to_account",
    header: "To",
    cell: ({ row }) => (
      <div
        onClick={() => navigator.clipboard.writeText(row.original.id)}
        className="cursor-pointer hover:underline text-start"
      >
        {row.original.to_account}
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
  // {
  //   id: "destination",
  //   header: "To / Destination",
  //   cell: ({ row }) => {
  //     const { type, metadata, to_account } = row.original;

  //     // Logic to show relevant info based on transfer type
  //     if (type === "wallet_to_wallet") {
  //       return <div className="text-start text-sm">{metadata.to_user_name || `User ${to_account}`}</div>;
  //     }
  //     if (type === "mt5_to_mt5") {
  //       return <div className="text-start text-sm">MT5: {metadata.destination_login}</div>;
  //     }
  //     return <div className="text-start text-sm">MT5: {to_account}</div>;
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusDot status={row.original?.status} size="md" />
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-start text-muted-foreground whitespace-nowrap">
        {formatIST(row.original.created_at)}
      </div>
    ),
  },
];