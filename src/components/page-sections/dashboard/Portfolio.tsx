"use client";
import { Icon } from "@/components/ui/icon";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import { item_variants } from "@/constants/framer-motion";
import { PillTabs } from "@/components/ui/pill-tabs";
import { useWalletBalance } from "@/hooks/useWallet";
import { useGetMt5AccList } from "@/hooks/useMt5";
import { Skeleton } from "@/components/ui/skeleton";

type Filter = "all" | "trading" | "wallet";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n || 0);

/** Reference "Portfolio" block: pills, dashed Balance label, big amount, Deposit + Transfer. */
const Portfolio = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const { data: wallet, isLoading: walletLoading } = useWalletBalance();
  const { accounts, isLoading: mt5Loading } = useGetMt5AccList();

  const walletBalance = Number((wallet as any)?.available_balance ?? wallet?.current_balance ?? 0);
  const tradingBalance = (accounts || [])
    .filter((a) => a.account_type?.toUpperCase() === "LIVE")
    .reduce((s, a) => s + Number(a.balance || 0), 0);
  const total =
    filter === "wallet" ? walletBalance : filter === "trading" ? tradingBalance : walletBalance + tradingBalance;
  const currency = wallet?.currency || "USD";
  const loading = walletLoading || mt5Loading;

  return (
    <motion.div variants={item_variants} className="flex flex-col gap-4">
      <h3 className="text-[18px] leading-6 font-medium text-foreground">Portfolio</h3>
      <div className="rounded-[4px] bg-card p-6 flex flex-col gap-6">
        <PillTabs<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "trading", label: "Trading Accounts" },
            { value: "wallet", label: "Wallet" },
          ]}
        />

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="inline-block text-[15px] leading-6 text-foreground border-b border-dashed border-muted-foreground">
              Balance
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              {loading ? (
                <Skeleton className="h-9 w-32 bg-field rounded-[4px]" />
              ) : (
                <span className="text-[32px] leading-9 font-medium text-foreground">{fmt(total)}</span>
              )}
              <button type="button" className="inline-flex items-center gap-1 text-[15px] leading-6 text-foreground">
                {currency}
                <Icon name="dropdown-16" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push("/root/funds/deposit")}
            className="h-10 inline-flex items-center justify-center gap-2 rounded-[4px] bg-primary px-6 py-2 text-[13.33px] text-black outline outline-1 -outline-offset-1 outline-transparent hover:brightness-110 hover:outline-primary transition-[filter,outline-color] duration-150 ease-in-out"
          >
            <Icon name="arrow-down-16" size={16} />
            Deposit
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push("/root/funds/transfer")}
          className="h-10 w-full inline-flex items-center justify-center gap-2 rounded-[4px] bg-field px-6 py-2 text-[15px] text-foreground outline outline-1 -outline-offset-1 outline-transparent hover:outline-primary/40 transition-[outline-color] duration-150 ease-in-out"
        >
          <Icon name="transfer-16" size={16} />
          Transfer
        </button>
      </div>
    </motion.div>
  );
};

export default Portfolio;
