"use client"
import React from 'react';
import { motion } from 'framer-motion';

export const TradingChart: React.FC = () => {
  const candles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: i * 50,
    h: 40 + Math.random() * 160,
    w: 8 + Math.random() * 12,
    bullish: Math.random() > 0.45,
    offset: Math.random() * 50,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20 overflow-hidden">
      <svg width="100%" height="100%" className="absolute bottom-0">
        <motion.g
          initial={{ x: 0 }}
          animate={{ x: -2000 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          {candles.map((candle) => (
            <motion.g key={candle.id}>
            
              <line
                x1={candle.x + 25}
                y1={600 - candle.offset - candle.h - 20}
                x2={candle.x + 25}
                y2={600 - candle.offset + 20}
                stroke={candle.bullish ? '#199216' : '#ff4444'}
                strokeWidth="2"
              />
            
              <motion.rect
                x={candle.x + 25 - candle.w / 2}
                y={600 - candle.offset - candle.h}
                width={candle.w}
                height={candle.h}
                fill={candle.bullish ? '#199216' : '#ff4444'}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: candle.id * 0.05, duration: 0.5 }}
              />
            </motion.g>
          ))}
          
        
          <motion.path
            d={`M 0,500 ${candles.map(c => `L ${c.x + 25},${600 - c.offset - c.h / 2}`).join(' ')}`}
            fill="none"
            stroke="#199216"
            strokeWidth="3"
            strokeDasharray="2000"
            initial={{ strokeDashoffset: 2000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            opacity="0.5"
          />
        </motion.g>
      </svg>
    </div>
  );
};
