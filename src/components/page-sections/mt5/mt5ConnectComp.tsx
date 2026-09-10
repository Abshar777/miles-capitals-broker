import { Icon } from "@/components/ui/icon";
import { useMt5UiStore } from "@/store/mt5uiStore";
import React from "react";

/** Reference empty state: round field icon, 24px title, grey caption, gold action. */
const Mt5ConnectComp = () => {
  const { setOpenModal } = useMt5UiStore();
  return (
    <div className="flex h-full min-h-[360px] w-full flex-col text-center items-center justify-center gap-3 rounded-[4px] border border-border">
      <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground">
        <Icon name="no-data-16" size={16} />
      </span>
      <h1 className="text-[24px] leading-8 font-medium text-foreground">No trading accounts yet</h1>
      <p className="text-[15px] leading-6 text-muted-foreground max-w-[360px]">
        Add your first MetaTrader 5 account to start trading
      </p>
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="mt-2 h-10 inline-flex items-center gap-2 rounded-[4px] bg-primary px-6 text-[13.33px] text-black outline outline-1 -outline-offset-1 outline-transparent hover:brightness-110 hover:outline-primary transition-[filter,outline-color] duration-150 ease-in-out"
      >
        <Icon name="plus-16" size={16} />
        Add Account
      </button>
    </div>
  );
};

export default Mt5ConnectComp;
