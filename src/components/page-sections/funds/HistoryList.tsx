"use client";
import { Icon } from "@/components/ui/icon";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { item_variants } from "@/constants/framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDot } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";

export type HistoryRow = {
  id: string;
  label: string;
  sub?: string;
  date?: string | null;
  amount: number | string;
  currency?: string;
  status?: string | null;
  direction?: "in" | "out" | "neutral";
  raw?: any;
};

const fmtDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return `${d.getDate().toString().padStart(2, "0")} ${d.toLocaleString("en-US", { month: "short" })}, ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const fmtAmt = (n: number | string) => {
  const v = typeof n === "string" ? Number(n) : n;
  if (isNaN(v as number)) return String(n);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(v as number);
};

/**
 * Reference history list under a funds form: "Deposit / Transfer" heading with a gold
 * "See More", then rows of currency icon + direction badge, label + method • date,
 * signed amount + status dot. Info button opens the caller's modal.
 */
const HistoryList = ({
  title,
  rows,
  isLoading,
  seeMoreHref = "/root/transactions",
  onInfo,
  emptyText = "No transaction found",
  limit = 5,
}: {
  title: string;
  rows: HistoryRow[];
  isLoading: boolean;
  seeMoreHref?: string;
  onInfo?: (row: HistoryRow) => void;
  emptyText?: string;
  limit?: number;
}) => {
  const list = rows.slice(0, limit);
  return (
    <motion.div variants={item_variants} className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] leading-6 font-medium text-foreground">{title}</h3>
        <Link
          href={seeMoreHref}
          className="inline-flex items-center gap-1 text-[15px] leading-6 text-primary hover:text-primary-hover"
        >
          See More
          <Icon name="chevron-right-16" size={16} />
        </Link>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 h-11">
              <Skeleton className="size-8 rounded-full bg-field" />
              <div className="flex-1 flex flex-col gap-1">
                <Skeleton className="h-4 w-32 bg-field rounded-[4px]" />
                <Skeleton className="h-3 w-24 bg-field rounded-[4px]" />
              </div>
              <Skeleton className="h-4 w-20 bg-field rounded-[4px]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <div className="h-[240px] rounded-[4px] border border-border flex flex-col items-center justify-center gap-3">
          <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground">
            <Icon name="no-data-16" size={16} />
          </span>
          <span className="text-[15px] leading-6 text-muted-foreground">{emptyText}</span>
        </div>
      )}

      {!isLoading && list.length > 0 && (
        <div className="flex flex-col">
          {list.map((r) => {
            const dir = r.direction ?? "in";
            return (
              <div key={r.id} className="flex items-center gap-2 h-[61px] border-b border-border last:border-0">
                <div className="relative size-10 shrink-0">
                  <img src="/svgs/currency/usd.svg" alt="" className="size-8 rounded-full" />
                  <span className="absolute left-5 top-5 flex size-5 items-center justify-center rounded-full bg-black/90 text-white">
                    {dir === "in" ? <Icon name="arrow-down-16" size={12} /> : dir === "out" ? <Icon name="arrow-up-16" size={12} /> : <Icon name="transfer-16" size={12} />}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-[15px] leading-6 text-foreground truncate">{r.label}</span>
                  <span className="text-[12px] leading-4 text-muted-foreground truncate">
                    {r.sub}
                    {r.sub && r.date ? " • " : ""}
                    {fmtDate(r.date)}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={cn(
                      "text-[15px] leading-6",
                      dir === "in" ? "text-positive" : dir === "out" ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {dir === "in" ? "+" : dir === "out" ? "-" : ""}
                    {fmtAmt(r.amount)} {r.currency || "USD"}
                  </span>
                  <StatusDot status={r.status} />
                </div>
                {onInfo && (
                  <button
                    type="button"
                    aria-label="Details"
                    onClick={() => onInfo(r)}
                    className="size-8 inline-flex items-center justify-center rounded-[4px] text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="info-16" size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryList;
