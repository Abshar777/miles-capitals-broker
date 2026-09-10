"use client";
import { container_variants, item_variants } from "@/constants/framer-motion";
import PageContainer from "@/components/providers/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import React from "react";
import { motion } from "framer-motion";
import { useGetMt5Balance } from "@/hooks/useMt5";
import Mt5ToMt5Card from "@/components/page-sections/funds/mt5ToMt5Card";
import MT5ToMt5History from "@/components/page-sections/funds/mt5ToMt5History";
import FundTabs from "@/components/page-sections/funds/fundstabs";

const page = () => {
  const { balance } = useGetMt5Balance();

  return (
    <>
      {/* <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="grid relative md:grid-cols-3 gap-4"
      >
        <Mt5ToMt5Card />
        <MT5ToMt5History />
      </motion.div> */}
    </>
  );
};

export default page;
