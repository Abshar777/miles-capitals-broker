"use client";
import { container_variants, item_variants } from "@/constants/framer-motion";
import TransferCard from "@/components/page-sections/funds/transferCard";
import PageContainer from "@/components/providers/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import React from "react";
import { motion } from "framer-motion";
import TransferHistory from "@/components/page-sections/funds/transferHistory";
import { useGetMt5Balance } from "@/hooks/useMt5";
import FundTabs from "@/components/page-sections/funds/fundstabs";

const page = () => {
  const { balance } = useGetMt5Balance();

  return (
    <>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="grid relative md:grid-cols-3 gap-4"
      >
        <TransferCard />
        <TransferHistory />
      </motion.div>
    </>
  );
};

export default page;
