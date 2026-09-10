"use client";

import FeedbackSection from "@/components/page-sections/feedback";
import PageContainer from "@/components/providers/page-container";
import { container_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";

const FeedbackPage = () => {
  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col w-full"
      >
        <FeedbackSection />
      </motion.div>
    </PageContainer>
  );
};

export default FeedbackPage;
