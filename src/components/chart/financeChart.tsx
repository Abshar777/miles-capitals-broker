"use clinet"
import React from 'react';
import { motion } from 'framer-motion';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area
} from 'recharts';
import { item_variants } from '@/constants/framer-motion';
import { WalletData, Transaction } from "@/types"
import { TTransferHistoryItemApiResponse, TWalletSummeryApiResponse } from '@/types/api.response';
import { formatIST } from '@/lib/utils';



interface FinancialChartsProps {
    wallet: TWalletSummeryApiResponse;
    transactions: TTransferHistoryItemApiResponse[];
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ wallet, transactions }) => {
    // Pie Data for Withdrawals Status
    const withdrawalData = [
        { name: 'Completed', amount: wallet?.withdrawals.by_status?.completed?.total_amount || 0, color: '#199216' },
        { name: 'Processing', amount: wallet?.withdrawals.by_status?.processing?.total_amount || 0, color: '#f59e0b' },
        { name: 'Rejected', amount: wallet?.withdrawals.by_status?.rejected?.total_amount || 0, color: '#ef4444' },
    ];

    // Deposit Data
    const depositData = [
        { name: 'Approved', value: wallet?.deposits.by_status?.approved?.total_amount, color: '#199216' },
        { name: 'Rejected', value: wallet?.deposits.by_status?.rejected?.total_amount, color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Activity over time (simplified from transaction dates)
    const activityData = transactions.slice().reverse().map(tx => ({
        date: formatIST(tx.created_at, { month: 'short', day: 'numeric' }),
        amount: tx.amount,
        type: tx.type
    }));

    return (
        <>
            <motion.div
                variants={item_variants}
                className="bg-card md:p-6  p-2 rounded-[var(--radius)] "
            >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    Withdrawal&nbsp;Distribution
                    <span className="text-xs font-normal opacity-50">(by amount)</span>
                </h3>

                <div className="h-64 w-full p-0">
                    <ResponsiveContainer className={"p-0 translate-x-[-7%]"} style={{
                        padding:"0",

                    }} width="110%" height="100%">
                        <BarChart data={withdrawalData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="var(--border)"
                            />

                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: 'var(--primary)'
                                }}
                                labelStyle={{
                                    color: 'var(--primary)',
                                    fontWeight: 600
                                }}
                                itemStyle={{
                                    color: 'var(--primary)'
                                }}
                                cursor={{ fill: 'rgba(0,0,0,0.2)' }}
                            />

                            {/* <Legend /> */}

                            <Bar
                                dataKey="amount"

                                radius={[8, 8, 0, 0]}
                                color='var(--primary)'
                                animationDuration={1200}
                            >
                                {withdrawalData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div
                variants={item_variants}
                className="bg-card w-full p-2 md:p-6 rounded-[var(--radius)] "
            >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    Recent Activity Trend
                    <span className="text-xs font-normal opacity-50">(Volume)</span>
                </h3>
                <div className="h-64">
                    <ResponsiveContainer className={"translate-x-[-8%]"} width="110%" height="100%">
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#199216" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#199216" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, opacity: 0.6 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, opacity: 0.6 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#199216"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorAmt)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </>
    );
};

export default FinancialCharts;
