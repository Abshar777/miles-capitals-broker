"use client";
import { Icon } from "@/components/ui/icon";
import { container_variants, item_variants } from "@/constants/framer-motion";
import React from "react";
import { motion } from "framer-motion";
import { useSupportUiStore } from "@/store/supportUiStore";
import { TTicketListResponse } from "@/types/ISupport";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagChip } from "@/components/ui/tag-chip";

const statusLabel = (s: string) =>
  s === "awaiting_admin" ? "Awaiting support" : s === "awaiting_client" ? "Awaiting you" : s.replace(/_/g, " ");

/** Reference ticket list: underline tabs + gold "+ New Ticket", 61px rows with hairlines. */
const TicketListing = ({
  tickets,
  isLoading,
  onSelectTicket,
  params,
  updateParams,
}: {
  tickets: TTicketListResponse["tickets"];
  isLoading: boolean;
  onSelectTicket: (id: string) => void;
  params: any;
  updateParams: Function;
}) => {
  const { setOpenModal } = useSupportUiStore();
  return (
    <motion.div variants={container_variants} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <Tabs value={params?.status ?? "all"} onValueChange={(value) => updateParams("status", value)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="awaiting_admin">Awaiting support</TabsTrigger>
            <TabsTrigger value="awaiting_client">Awaiting you</TabsTrigger>
          </TabsList>
        </Tabs>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="h-12 inline-flex items-center gap-1 text-[15px] leading-6 text-primary hover:text-primary-hover whitespace-nowrap"
        >
          <Icon name="plus-16" size={16} />
          New Ticket
        </button>
      </div>

      <div className="flex flex-col">
        {tickets.length === 0 && !isLoading ? (
          <div className="h-[240px] rounded-[4px] border border-border flex flex-col items-center justify-center gap-3">
            <span className="size-10 rounded-full bg-field inline-flex items-center justify-center text-muted-foreground">
              <Icon name="no-data-16" size={16} />
            </span>
            <span className="text-[18px] leading-6 font-medium text-foreground">No tickets yet</span>
            <span className="text-[15px] leading-6 text-muted-foreground">Create your first ticket to get help.</span>
          </div>
        ) : (
          tickets.map((ticket) => (
            <motion.button
              type="button"
              key={ticket.id}
              variants={item_variants}
              onClick={() => onSelectTicket(ticket.id)}
              className="group relative flex items-center gap-4 min-h-[61px] py-2 border-b border-border text-left hover:bg-card/60 transition-colors px-2 -mx-2"
            >
              {ticket.unread_client_count > 0 && <span className="size-2 rounded-full bg-primary shrink-0" />}
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="flex items-center gap-2 text-[15px] leading-6 text-foreground">
                  <span className="truncate">{ticket.subject}</span>
                  <TagChip>#{ticket.id}</TagChip>
                </span>
                <span className="text-[12px] leading-4 text-muted-foreground truncate">
                  {ticket.last_message_preview}
                </span>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <TagChip tone={ticket.status === "awaiting_client" ? "positive" : "default"}>
                  {statusLabel(ticket.status)}
                </TagChip>
                <span className="text-[12px] leading-4 text-muted-foreground">
                  {formatDistanceToNow(new Date(ticket.last_message_at), { addSuffix: true })}
                </span>
              </div>
              <Icon name="chevron-right-16" size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TicketListing;
