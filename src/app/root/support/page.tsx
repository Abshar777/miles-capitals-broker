"use client";

import SupportForm from "@/components/forms/supportForm";
import RaiseTicketConnect from "@/components/page-sections/support/raiseTicketConnect";
import TicketListing from "@/components/page-sections/support/ticketListing";
import PageContainer from "@/components/providers/page-container";
import { Modal } from "@/components/ui/modal";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { useTickets } from "@/hooks/useSupport";
import { useSupportUiStore } from "@/store/supportUiStore";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";

/** Reference Helpdesk: underline status tabs, "+ New Ticket", ticket rows. */
const page = () => {
  const { openModal, setOpenModal, setTicketId } = useSupportUiStore();
  const { isLoading, tickets, params, updateParams, isDataLoaded } = useTickets();
  const router = useRouter();
  const onSelectTicket = (id: string) => {
    setTicketId(id);
    router.push(`/root/support/${id}`);
  };
  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-6 w-full"
      >
        <Modal
          title="New Ticket"
          description="Tell us what you need help with"
          isOpen={openModal}
          height={80}
          onClose={() => setOpenModal(false)}
          children={<SupportForm />}
        />
        <motion.div variants={item_variants}>
          {!isLoading && !isDataLoaded && <RaiseTicketConnect />}
          {isDataLoaded && (
            <TicketListing
              isLoading={isLoading}
              tickets={tickets}
              onSelectTicket={onSelectTicket}
              params={{ status: params?.status ?? "all" }}
              updateParams={updateParams}
            />
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
