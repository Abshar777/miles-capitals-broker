"use client";
import { Icon } from "@/components/ui/icon";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import { item_variants } from "@/constants/framer-motion";
import { useGetMt5AccList } from "@/hooks/useMt5";
import { useMt5UiStore } from "@/store/mt5uiStore";
import { TagChip } from "@/components/ui/tag-chip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n || 0);

/** Reference "Trading Accounts" row: 352px cards in a horizontal scroller with arrows. */
const TradingAccounts = () => {
  const router = useRouter();
  const { accounts, isLoading } = useGetMt5AccList();
  const { setOpenModal } = useMt5UiStore();
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 368, behavior: "smooth" });

  return (
    <motion.div variants={item_variants} className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-[18px] leading-6 font-medium text-foreground">Trading Accounts</h3>
          <button
            type="button"
            onClick={() => {
              router.push("/root/mt5");
              setOpenModal(true);
            }}
            className="inline-flex items-center gap-1 text-[15px] leading-6 text-primary hover:text-primary-hover"
          >
            <Icon name="plus-16" size={16} />
            Create New
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="size-6 flex items-center justify-center rounded-[4px] bg-field text-muted-foreground hover:text-foreground"
          >
            <Icon name="chevron-left-16" size={16} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="size-6 flex items-center justify-center rounded-[4px] bg-field text-foreground"
          >
            <Icon name="chevron-right-16" size={16} />
          </button>
        </div>
      </div>

      <div ref={scroller} className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[178px] w-[352px] shrink-0 rounded-[4px] bg-card" />
          ))}

        {!isLoading && (accounts || []).length === 0 && (
          <button
            type="button"
            onClick={() => {
              router.push("/root/mt5");
              setOpenModal(true);
            }}
            className="h-[178px] w-[352px] shrink-0 rounded-[4px] border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="plus-16" size={20} />
            <span className="text-[15px]">Create your first trading account</span>
          </button>
        )}

        {!isLoading &&
          (accounts || []).map((a) => {
            const live = a.account_type?.toUpperCase() === "LIVE";
            return (
              <div
                key={a.login}
                className="h-[178px] w-[352px] shrink-0 rounded-[4px] bg-card p-4 flex flex-col cursor-pointer"
                onClick={() => router.push(`/root/mt5?login=${a.login}`)}
              >
                <div className="flex items-start justify-between h-8">
                  <div className="flex items-center gap-2">
                    <img src="/svgs/currency/usd.svg" alt="" className="size-8 rounded-full" />
                    {!live && <TagChip>Demo</TagChip>}
                  </div>
                  <TagChip tone="light">MT5</TagChip>
                </div>
                <div className="mt-4 text-[18px] leading-6 font-medium text-foreground">
                  {fmt(a.balance)} <span className="text-muted-foreground">USD</span>
                </div>
                <div className="text-[12px] leading-4 text-muted-foreground">{a.login}</div>
                <div className="mt-auto">
                  {live ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/root/funds/transfer?accountId=${a.login}`);
                      }}
                      className="h-10 w-full rounded-[4px] bg-field px-6 py-2 text-[15px] text-foreground outline outline-1 -outline-offset-1 outline-transparent hover:outline-primary/40 transition-[outline-color] duration-150 ease-in-out"
                    >
                      Transfer
                    </button>
                  ) : (
                    <div className={cn("h-10 flex items-center text-[15px] text-muted-foreground")}>
                      {a.account_category || "Demo"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
};

export default TradingAccounts;
