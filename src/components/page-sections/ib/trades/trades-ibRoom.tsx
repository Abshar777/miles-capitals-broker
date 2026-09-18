"use client";
import React from "react";

import { useGetIbTrades } from "@/hooks/useIB";
import { SkeletonCard, SkeletonChart } from "./loading";
import SummaryCard from "@/components/ui/stat-card";
import { Activity, PieChart, LayoutGrid, User } from "lucide-react";
import TradeChart from "./tradeChart";
import SymbolData from "./symbolData";
import TradesIbRoomList from "@/components/table/trades-ib/tradesIbList";

const TradesIbRoom = () => {
  const { data, isLoading, error, isError } = useGetIbTrades();

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <SummaryCard
              title="Net Profit"
              value={`$${parseFloat(data!.summary.net_profit).toFixed(2)}`}
              icon={<Activity className="w-5 h-5" />}
              trend={parseFloat(data!.summary.net_profit) >= 0 ? "up" : "down"}
            />
            <SummaryCard
              title="Total Volume"
              value={`${parseFloat(data!.summary.total_volume).toFixed(
                2
              )} Lots`}
              icon={<PieChart className="w-5 h-5" />}
            />
            <SummaryCard
              title="Trade Count"
              value={data!.summary.total_trades.toString()}
              icon={<LayoutGrid className="w-5 h-5" />}
            />
            <SummaryCard
              title="Total Clients"
              value={data!.summary.total_clients.toString()}
              icon={<User className="w-5 h-5" />}
            />
          </>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 w-full   bg-card rounded-xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Performance Over Time
            </h3>
          </div>
          <div className="h-[350px]">
            {isLoading ? (
              <SkeletonChart />
            ) : (
              <TradeChart trades={data?.trades || []} />
            )}
          </div>
        </div>
        <SymbolData data={data} loading={isLoading} />
      </section>
      <TradesIbRoomList  trades={data?.trades || []} isLoading={isLoading} />
    </>
  );
};

export default TradesIbRoom;
