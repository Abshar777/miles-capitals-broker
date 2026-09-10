import React from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
}

/** Reference stat card: icon in a field square, 12px grey label, 18px value. */
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="rounded-[4px] bg-card p-4 flex items-center gap-4">
      <div className="size-10 rounded-[4px] bg-field text-muted-foreground flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] leading-4 text-muted-foreground">{title}</span>
        <span
          className={
            trend === "down" ? "text-[18px] leading-6 font-medium text-destructive" : "text-[18px] leading-6 font-medium text-foreground"
          }
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export default SummaryCard;
