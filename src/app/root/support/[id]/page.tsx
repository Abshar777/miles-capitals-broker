"use client";

import TicketDetail from "@/components/page-sections/support/ticketDetails";
import PageContainer from "@/components/providers/page-container";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { useTickets } from "@/hooks/useSupport";
import { useSupportUiStore } from "@/store/supportUiStore";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

const page = () => {
  const { id } = useParams();
  const { isLoading } = useTickets();
  const router = useRouter();
  const { ticketId } = useSupportUiStore();
  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-6 w-full"
      >
        <motion.div variants={item_variants}>
          {id && !isLoading && (
            <TicketDetail ticketId={(id as string) || (ticketId as string)} onBack={() => router.push("/root/support")} />
          )}
        </motion.div>
        {isLoading && (
          <div className="flex items-center justify-center h-[240px] w-full">
            <Spinner color="primary" size="lg" />
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
};

export default page;
