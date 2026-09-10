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
import { TIBWalletCommissionApiResponse, TIBWalletTransactionApiResponse } from "@/types/IIB";

// import { useDeleteBranch } from "@/hooks/useBranch";
export type Cloumn = TIBWalletCommissionApiResponse['commissions'][0] & {
  rowNumber: number;
};

export const columns: ColumnDef<Cloumn>[] = [
  {
    accessorKey: "id",
    header: "Reward ID",
    cell: ({ row }) => (
      <div className="text-start">{row.original?.id}</div>
    ),
  },
  {
    accessorKey: "trader_id",
    header: "User Id",
    cell: ({ row }) => (
      <div className="text-start">{row.original?.trader_id}</div>
    ),
  },
  {
    accessorKey: "trade_id",
    header: "Trade ID",
    cell: ({ row }) => (
      <div className="text-start">{row.original?.trade_id}</div>
    ),
  },
  {
    accessorKey: "mt5_login",
    header: "MT5 Login",
    cell: ({ row }) => (
      <div>{row.original?.mt5_login}</div>
    ),
  },
  {
    accessorKey: "trade_symbol",
    header: "Symbol",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original?.trade_symbol}</Badge>
    ),
  },
  {
    accessorKey: "trade_type",
    header: "Type",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original?.trade_type?.toLowerCase() === "buy"
            ? "default"
            : "destructive"
        }
      >
        {row.original?.trade_type}
      </Badge>
    ),
  },
  // {
  //   accessorKey: "trade_volume",
  //   header: "Volume",
  //   cell: ({ row }) => (
  //     <div>{row.original?.trade_volume}</div>
  //   ),
  // },
  // {
  //   accessorKey: "trading_group_name",
  //   header: "Trading Group",
  //   cell: ({ row }) => (
  //     <div>{row.original?.trading_group_name}</div>
  //   ),
  // },
  // {
  //   accessorKey: "reward_per_lot",
  //   header: "Reward / Lot",
  //   cell: ({ row }) => (
  //     <div>
  //       {row.original?.reward_per_lot} {row.original?.currency}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "volume_lots",
    header: "Volume (Lots)",
  },
  // {
  //   accessorKey: "trade_reward_total",
  //   header: "Total Reward",
  //   cell: ({ row }) => (
  //     <div className="font-medium text-green-600">
  //       {row.original?.trade_reward_total} {row.original?.currency}
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "trader_email",
  //   header: "Trader Email",
  //   cell: ({ row }) => (
  //     <div className="max-w-[200px] truncate">
  //       {row.original?.trader_email}
  //     </div>
  //   ),
  // },

  // {
  //   accessorKey: "level",
  //   header: "Level",
  //   cell: ({ row }) => (
  //     <div>{row.original?.level}</div>
  //   ),
  // },
  // {
  //   accessorKey: "ratio",
  //   header: "Ratio (%)",
  //   cell: ({ row }) => (
  //     <div>{row.original?.ratio}%</div>
  //   ),
  // },
  {
    accessorKey: "amount",
    header: "Reward Amount",
    cell: ({ row }) => (
      <div className="font-semibold">
        {row.original?.amount} {row.original?.currency}
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
  // {
  //   accessorKey: "wallet_credited",
  //   header: "Wallet Credited",
  //   cell: ({ row }) => (
  //     <Badge
  //       variant={
  //         row.original?.wallet_credited ? "default" : "destructive"
  //       }
  //     >
  //       {row.original?.wallet_credited ? "Yes" : "No"}
  //     </Badge>
  //   ),
  // },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => (
      <div>
        {formatIST(row.original?.created_at, { day: "2-digit", month: "short", year: "numeric" })}
      </div>
    ),
  },
];
