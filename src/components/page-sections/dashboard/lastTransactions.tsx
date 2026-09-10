"use client";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { item_variants } from "@/constants/framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDot } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";
import { TAllTransaction } from "@/hooks/useWallet";

const typeLabel: Record<TAllTransaction["type"], string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  wallet_to_mt5: "Transfer to MT5",
  internal_transfer: "Internal Transfer",
  mt5_to_wallet: "Transfer to Wallet",
};

const isIn = (t: TAllTransaction["type"]) => t === "deposit" || t === "mt5_to_wallet";
const isOut = (t: TAllTransaction["type"]) => t === "withdrawal" || t === "wallet_to_mt5";

const fmtDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}, ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const fmtAmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n || 0);

/** Green currency icon with a small direction arrow badge, as in the reference. */
export const CurrencyIcon = ({ type }: { type?: TAllTransaction["type"] }) => (
  <div className="relative size-10 shrink-0">
    <img src="/svgs/currency/usd.svg" alt="" className="size-8 rounded-full" />
    {type && (
      <span className="absolute left-5 top-5 flex size-5 items-center justify-center rounded-full bg-black/90 text-white">
        {isIn(type) ? <Icon name="arrow-down-16" size={12} /> : isOut(type) ? <Icon name="arrow-up-16" size={12} /> : <Icon name="transfer-16" size={12} />}
      </span>
    )}
  </div>
);

/** Reference "Last Transactions": rows of icon, name + date, amount + status dot; "All" link. */
const LastTransactions = ({ data, isLoading }: { data: TAllTransaction[]; isLoading: boolean }) => {
  const rows = (data || []).slice(0, 4);

  return (
    <motion.div variants={item_variants} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] leading-6 font-medium text-foreground">Last Transactions</h3>
        <Link
          href="/root/transactions"
          className="inline-flex items-center gap-1 text-[15px] leading-6 text-primary hover:text-primary-hover"
        >
          All
          <Icon name="chevron-right-16" size={16} />
        </Link>
      </div>

      <div className="rounded-[4px] bg-card p-6 flex flex-col gap-4 min-h-[232px]">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full bg-field" />
              <div className="flex-1 flex flex-col gap-1">
                <Skeleton className="h-4 w-24 bg-field rounded-[4px]" />
                <Skeleton className="h-3 w-16 bg-field rounded-[4px]" />
              </div>
              <Skeleton className="h-4 w-16 bg-field rounded-[4px]" />
            </div>
          ))}

        {!isLoading && rows.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-[15px] text-muted-foreground">
            No transactions yet
          </div>
        )}

        {!isLoading &&
          rows.map((e, i) => (
            <div key={e.id || i} className="flex items-center gap-2 h-10">
              <CurrencyIcon type={e.type} />
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[15px] leading-6 text-foreground truncate">
                  {typeLabel[e.type] ?? e.type}
                </span>
                <span className="text-[12px] leading-4 text-muted-foreground">{fmtDate(e.created_at)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={cn(
                    "text-[15px] leading-6",
                    isIn(e.type) ? "text-positive" : isOut(e.type) ? "text-destructive" : "text-foreground"
                  )}
                >
                  {fmtAmt(e.amount)} {e.currency}
                </span>
                <StatusDot status={e.status} />
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default LastTransactions;
