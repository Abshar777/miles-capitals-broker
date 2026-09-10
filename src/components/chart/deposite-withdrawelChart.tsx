'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { week: 'Week 1', deposits: 100, withdrawals: 10 },
  { week: 'Week 2', deposits: 500, withdrawals: 33 },
  { week: 'Week 3', deposits: 4500, withdrawals: 50 },
  { week: 'Week 4', deposits: 3900, withdrawals: 37.56 },
  { week: 'Current', deposits: 5010, withdrawals: 130.56 },
]

export function DepositWithdrawalChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="week" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
          formatter={(value) => `$${Number(value).toFixed(2)}`}
        />
        <Area
          type="monotone"
          dataKey="deposits"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorDeposits)"
          isAnimationActive={true}
          animationDuration={1500}
          name="Deposits"
        />
        <Area
          type="monotone"
          dataKey="withdrawals"
          stroke="#ef4444"
          fillOpacity={1}
          fill="url(#colorWithdrawals)"
          isAnimationActive={true}
          animationDuration={1500}
          name="Withdrawals"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
