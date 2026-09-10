"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { cn, formatIST } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TMyClientsApiResponse } from "@/types/api.response";
import { FaCheck, FaXmark } from "react-icons/fa6";

export type ReferredClientColumn = TMyClientsApiResponse["clients"][0] & {
  rowNumber: number;
};

export const columns: ColumnDef<ReferredClientColumn>[] = [
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => (
      <div className="text-start font-mono text-xs text-muted-foreground">
        #{row.original?.user_id}
      </div>
    ),
  },
  {
    accessorKey: "firstname",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">
          {row.original?.firstname} {row.original?.lastname}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
          {row.original?.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <div className="text-start">{row.original?.level ?? "—"}</div>
    ),
  },
  {
    accessorKey: "is_ib",
    header: "Is IB",
    cell: ({ row }) =>
      row.original?.is_ib ? (
        <Badge variant="success" className="gap-1 text-xs">
          <FaCheck className="w-2.5 h-2.5" /> IB
        </Badge>
      ) : (
        <Badge variant="secondary" className="gap-1 text-xs">
          <FaXmark className="w-2.5 h-2.5" /> Client
        </Badge>
      ),
  },
  {
    accessorKey: "total_volume",
    header: "Volume",
    cell: ({ row }) => (
      <div className="tabular-nums">{row.original?.total_volume ?? 0}</div>
    ),
  },
  {
    accessorKey: "ib_commission_earned",
    header: "Commission Earned",
    cell: ({ row }) => (
      <div className="font-semibold text-emerald-500 tabular-nums">
        {row.original?.ib_commission_earned ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "mt5_accounts",
    header: "MT5 Accounts",
    cell: ({ row }) => (
      <div className="text-start">{row.original?.mt5_accounts?.length ?? 0}</div>
    ),
  },
  {
    accessorKey: "joined_at",
    header: "Joined At",
    cell: ({ row }) => (
      <div className="text-start text-sm">
        {formatIST(row.original?.joined_at as string, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>
    ),
  },
];
