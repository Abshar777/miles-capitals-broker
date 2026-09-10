"use client";

import { item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, Settings } from "lucide-react";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: any = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
export const AddWalletCard = () => {
  return (
    <motion.div
      variants={item_variants}
      whileHover={{
        scale: 1.01,
        y: -2,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.95 }}
      className="relative bg-card backdrop-blur-md border border-foreground/20  border-dashed rounded-2xl p-6 cursor-pointer group overflow-hidden flex flex-col items-center justify-center min-h-[120px]"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Add wallet glow effect */}
      {/* <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at center, rgba(34, 197, 94, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)`,
          filter: "blur(1px)",
        }}
        initial={false}
      /> */}

      {/* Outer glow for add wallet */}
      {/* <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-40 transition-all duration-500"
        style={{
          background: `linear-gradient(45deg, rgba(34, 197, 94, 0.3), rgba(59, 130, 246, 0.3))`,
          filter: "blur(6px)",
        }}
        initial={false}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.5 },
        }}
      /> */}

      <div className="relative z-10">
        <motion.div
          className="w-12 h-12 rounded-full bg-card/80 flex items-center justify-center mb-4 group-hover:bg-card/80 transition-all duration-300 shadow-lg"
          whileHover={{
            rotate: 180,
            scale: 1.1,
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
          }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Plus
            size={20}
            className=" text-foreground/80 group-hover:text-foreground transition-colors duration-300"
          />
        </motion.div>

        <motion.p
          className="text-xs text-foreground/60 uppercase tracking-wider mb-1 font-medium"
          whileHover={{
            opacity: 1,
            color: "#9ca3af",
          }}
        >
          WALLET
        </motion.p>

        <motion.h3
          className="text-gray-400 font-semibold text-sm group-hover:text-foreground transition-all duration-300"
          whileHover={{
            x: 2,
            textShadow: "0 0 8px rgba(59, 130, 246, 0.3)",
          }}
        >
          Add Wallet
        </motion.h3>
      </div>
    </motion.div>
  );
};
