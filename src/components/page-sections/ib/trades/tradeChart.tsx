
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TIBSummaryApiResponse } from '@/types/api.response';
import { formatIST } from '@/lib/utils';

interface TradeChartProps {
  trades: TIBSummaryApiResponse['trades'];
}

const TradeChart: React.FC<TradeChartProps> = ({ trades }) => {
 
  const sortedTrades = [...trades].sort((a, b) => new Date(a.open_time).getTime() - new Date(b.open_time).getTime());
    // console.log(sortedTrades)
  let runningProfit = 0;
  const data = sortedTrades.map((trade, index) => {
    runningProfit += parseFloat(trade.net_profit);
    return {
      name: `Trade ${trade.trade_id}`,
      profit: runningProfit,
      date: formatIST(trade.open_time, { day: "2-digit", month: "short", year: "numeric" }),
      ticket: trade.trade_ticket_id
    };
  });

//   console.log(data,"data")

  return (
   <div className="h-[300px] w-full">
  <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--muted-foreground)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="var(--muted-foreground)" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--foreground)'
          }}
          itemStyle={{ color: 'var(--primary)' }}
        />
        <Area 
          type="monotone" 
          dataKey="profit" 
          stroke="var(--primary)" 
          fillOpacity={1} 
          fill="url(#colorProfit)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
    </div>
  );
};

export default TradeChart;
