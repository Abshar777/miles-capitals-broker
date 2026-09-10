import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Extra content rendered under the card (e.g. Back link). */
  after?: React.ReactNode;
};

/** 480px bordered card centered in the auth frame. */
const AuthCard = ({ children, className, after }: Props) => (
  <div className="flex-1 flex flex-col items-center px-4 pt-6 pb-10 sm:pt-10">
    <div
      className={cn(
        "w-full max-w-[480px] rounded-lg border border-border bg-background p-6 sm:p-10 flex flex-col gap-4",
        className
      )}
    >
      {children}
    </div>
    {after && <div className="w-full max-w-[480px] mt-4">{after}</div>}
  </div>
);

export default AuthCard;
