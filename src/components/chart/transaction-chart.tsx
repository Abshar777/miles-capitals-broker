'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { status: 'Completed', count: 3, amount: 130.56 },
  { status: 'Processing', count: 1, amount: 33 },
  { status: 'Rejected', count: 2, amount: 17 },
  { status: 'Approved', count: 2, amount: 5010 },
]

export function TransactionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="status" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
        />
        <Legend />
        <Bar
          dataKey="count"
          fill="#8b5cf6"
          isAnimationActive={true}
          animationDuration={1500}
          name="Transaction Count"
        />
        <Bar
          dataKey="amount"
          fill="#06b6d4"
          isAnimationActive={true}
          animationDuration={1500}
          name="Amount (USD)"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
