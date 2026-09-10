import React from "react";
import { cn } from "@/lib/utils";

const COLOR: Record<string, string> = {
  pending: "bg-warning",
  submitted: "bg-warning",
  processing: "bg-warning",
  transfer_out: "bg-warning",
  completed: "bg-positive",
  success: "bg-positive",
  approved: "bg-positive",
  active: "bg-positive",
  failed: "bg-destructive",
  rejected: "bg-destructive",
  cancelled: "bg-destructive",
  declined: "bg-destructive",
};

const LABEL: Record<string, string> = {
  transfer_out: "Transfer out",
};

/** 8px colored dot + capitalised label, as used in reference lists and tables. */
export const StatusDot = ({
  status,
  className,
  size = "sm",
}: {
  status?: string | null;
  className?: string;
  size?: "sm" | "md";
}) => {
  const key = (status || "").toLowerCase();
  const label = LABEL[key] || key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-foreground",
        size === "sm" ? "text-[12px] leading-4" : "text-[15px] leading-6",
        className
      )}
    >
      <span className={cn("size-2 rounded-full shrink-0", COLOR[key] || "bg-muted-foreground")} />
      {label || "—"}
    </span>
  );
};

export default StatusDot;
