"use client";
import { Icon } from "@/components/ui/icon";
import { container_variants, item_variants } from "@/constants/framer-motion";
import PageContainer from "@/components/providers/page-container";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import UpgradForm from "@/components/forms/upgradForm";

const page = () => {
  const router = useRouter();
  return (
    <PageContainer scrollable={true}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container_variants}
        className="flex flex-1 flex-col gap-6 w-full max-w-[880px]"
      >
        <motion.div variants={item_variants} className="flex items-center justify-between">
          <h3 className="text-[18px] leading-6 font-medium text-foreground">Upgrade Level</h3>
          <button
            type="button"
            onClick={() => router.push("/root/verification")}
            className="inline-flex items-center gap-2 text-[15px] leading-6 text-muted-foreground hover:text-foreground"
          >
            <Icon name="arrow-left-16" size={16} />
            Back
          </button>
        </motion.div>
        <motion.div variants={item_variants}>
          <UpgradForm />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default page;
