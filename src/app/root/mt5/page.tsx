"use client";

import Mt5ConnectCard from "@/components/page-sections/mt5/mt5Card";
import PageContainer from "@/components/providers/page-container";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import React from "react";

const page = () => {
  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col w-full"
      >
        <motion.div variants={item_variants}>
          <Mt5ConnectCard />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default page;
