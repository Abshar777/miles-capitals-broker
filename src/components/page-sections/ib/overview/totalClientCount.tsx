"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TotalClientCount = ({
  totalDirectClients,
  totalDescendantsClients,
  isLoading,
}: {
  totalDirectClients: number;
  totalDescendantsClients: number;
  isLoading: boolean;
}) => {
  if (isLoading) return <Skeleton className="h-[88px] w-full rounded-[4px] bg-card" />;
  return (
    <div className="rounded-[4px] bg-card p-4 grid grid-cols-2 gap-4">
      <div className="flex flex-col border-r border-border">
        <span className="text-[12px] leading-4 text-muted-foreground">Direct clients</span>
        <span className="text-[18px] leading-6 font-medium text-foreground">{totalDirectClients || 0}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] leading-4 text-muted-foreground">Total clients</span>
        <span className="text-[18px] leading-6 font-medium text-foreground">{totalDescendantsClients || 0}</span>
      </div>
    </div>
  );
};

export default TotalClientCount;
