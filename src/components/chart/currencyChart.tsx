'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

const data = [
  { name: 'USD', value: 170.56, deposits: 100, withdrawals: 70.56 },
  { name: 'INR', value: 5000, deposits: 5000, withdrawals: 0 },
]

const COLORS = ['#3b82f6', '#f59e0b']

export function CurrencyChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={true}
          animationDuration={1500}
          animationBegin={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
          formatter={(value) => `$${Number(value).toFixed(2)}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
