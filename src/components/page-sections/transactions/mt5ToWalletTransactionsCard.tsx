"use client";
import { motion } from "framer-motion";
import { container_variants, item_variants } from "@/constants/framer-motion";
import Mt5ToWalletList from "@/components/table/mt5ToWallet/mt5ToWalletList";

const Mt5ToWalletTransactionsCard = () => {
  return (
    <motion.div
      initial="hidden"
      className="w-full h-full"
      animate="visible"
      variants={container_variants}
    >
      <motion.div className="w-full h-full" variants={item_variants}>
        <Mt5ToWalletList />
      </motion.div>
    </motion.div>
  );
};

export default Mt5ToWalletTransactionsCard;
