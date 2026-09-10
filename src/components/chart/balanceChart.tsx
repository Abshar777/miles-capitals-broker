'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts'

const data = [
  { date: 'Jan 1', balance: 2000, available: 1800 },
  { date: 'Jan 8', balance: 3000, available: 2800 },
  { date: 'Jan 15', balance: 4500, available: 4200 },
  { date: 'Jan 22', balance: 3800, available: 3600 },
  { date: 'Jan 29', balance: 4879, available: 4879 },
  { date: 'Feb 5', balance: 5200, available: 5100 },
  { date: 'Feb 14', balance: 4879, available: 4879 },
]

export function BalanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
          cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: '#3b82f6', r: 5 }}
          activeDot={{ r: 7 }}
          name="Total Balance"
          isAnimationActive={true}
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="available"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
          name="Available Balance"
          isAnimationActive={true}
          animationDuration={1500}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
