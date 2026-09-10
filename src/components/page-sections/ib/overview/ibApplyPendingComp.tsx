import { Icon } from "@/components/ui/icon";
import React from "react";

/** Reference empty state: IB application pending. */
const IBApplyPendingComp = () => {
  return (
    <div className="flex h-full min-h-[360px] w-full flex-col text-center items-center justify-center gap-3 rounded-[4px] border border-border">
      <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-warning">
        <Icon name="clock-16" size={16} />
      </span>
      <h1 className="text-[24px] leading-8 font-medium text-foreground">Application under review</h1>
      <p className="text-[15px] leading-6 text-muted-foreground max-w-[400px]">
        Your IB plan request is pending admin approval. We will notify you once it is reviewed.
      </p>
    </div>
  );
};

export default IBApplyPendingComp;
