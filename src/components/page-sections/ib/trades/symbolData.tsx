import React from 'react'
import { PieChart } from 'lucide-react'
import { TIBSummaryApiResponse } from '@/types/api.response';
import { Progress } from '@heroui/react';

const SymbolData = ({data, loading}: {data:  TIBSummaryApiResponse, loading: boolean}) => {
  return (
  <>
  <div className="bg-card rounded-xl  p-6 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Symbol Distribution
            </h3>
            <div className="flex-1 min-h-[300px]">
               {loading ? (
                 <div className="space-y-4">
                   {Array(4).fill(0).map((_, i) => (
                     <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                   ))}
                 </div>
               ) : (
                <div className="space-y-4">
                  {Array.from(new Set(data!.trades.map(t => t.symbol))).map(symbol => {
                    const count = data!.trades.filter(t => t.symbol === symbol).length;
                    const percentage = (count / data!.trades.length) * 100;
                    return (
                      <div key={symbol} className="group cursor-default">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{symbol}</span>
                          <span className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                         <Progress value={percentage}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
               )}
            </div>
          </div>
  </>
  )
}

export default SymbolData