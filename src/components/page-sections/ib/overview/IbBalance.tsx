"use client";

import IbTransferWalletForm from "@/components/forms/ibTransferToWalletForm";
import { Modal } from "@/components/ui/modal";
import { item_variants } from "@/constants/framer-motion";
import { useIbWalletBalance } from "@/hooks/useIbWallet";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import React, { useState } from "react";

const fmt = (n: any) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(n) || 0);

/** Reference IB "Wallet" card: icon + USD/ID, balance, Total Rewards, navy Transfer. */
const IbWalletBalanceCards = () => {
  const { data, isLoading, error } = useIbWalletBalance();
  const [showTransferModal, setShowTransferModal] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-[220px] w-full rounded-[4px] bg-card" />;
  }

  if (error || !data) {
    return (
      <div className="rounded-[4px] bg-card p-4 flex flex-col gap-1">
        <h3 className="text-[18px] leading-6 font-medium text-foreground">Wallet</h3>
        <p className="text-[15px] leading-6 text-muted-foreground">
          No IB wallet found. It is created once your IB application is approved.
        </p>
      </div>
    );
  }

  const currency = data?.currency ?? "USD";

  return (
    <motion.div variants={item_variants} className="rounded-[4px] bg-card p-4 flex flex-col gap-4">
      <h3 className="text-[18px] leading-6 font-medium text-foreground">Wallet</h3>

      <div className="flex items-center gap-2">
        <img src="/svgs/currency/usd.svg" alt="" className="size-8 rounded-full" />
        <div className="flex flex-col">
          <span className="text-[15px] leading-6 text-foreground">{currency}</span>
          <span className="text-[12px] leading-4 text-muted-foreground">IB wallet</span>
        </div>
      </div>

      <div className="text-[24px] leading-8 font-medium text-foreground">
        {fmt(data?.available_balance)} <span className="text-muted-foreground text-[15px]">{currency}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {[
          { label: "Total Rewards", value: data?.total_earned },
          { label: "Total Balance", value: data?.balance },
          { label: "On Hold", value: data?.hold_balance },
          { label: "Withdrawn", value: data?.total_withdrawn },
        ].map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="text-[12px] leading-4 text-muted-foreground">{s.label}</span>
            <span className="text-[12px] leading-4 text-foreground">
              {fmt(s.value)} {currency}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowTransferModal(true)}
        className="h-10 w-full rounded-[4px] bg-field px-6 text-[15px] text-foreground outline outline-1 -outline-offset-1 outline-transparent hover:outline-primary/40 transition-[outline-color] duration-150 ease-in-out"
      >
        Transfer
      </button>

      <Modal
        title="Transfer to Main Wallet"
        description="Move funds from your IB wallet to your main wallet"
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
      >
        <IbTransferWalletForm onSubmit={() => setShowTransferModal(false)} />
      </Modal>
    </motion.div>
  );
};

export default IbWalletBalanceCards;
