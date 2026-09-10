"use client"
import React from 'react';
import { motion } from 'framer-motion';

const currencies = ['$', '€', '£', '¥', '₿', 'Ξ', 'CHF', 'AU', 'CA'];

export const CurrencyRain: React.FC = () => {
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    symbol: currencies[Math.floor(Math.random() * currencies.length)],
    left: `${Math.random() * 100}%`,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 5,
    size: 14 + Math.random() * 24,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -50, opacity: 0 }}
          animate={{ 
            y: ['0vh', '110vh'],
            opacity: [0, p.opacity, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: p.left,
            fontSize: p.size,
            fontWeight: 'bold',
            color: 'var(--primary)',
            filter: 'blur(1px)'
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};
