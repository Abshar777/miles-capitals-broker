"use client";
import { Icon } from "@/components/ui/icon";
import { motion, AnimatePresence } from "framer-motion";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { cn, formatIST } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { useTicketDetails } from "@/hooks/useSupport";
import { useSupportSocket } from "@/hooks/useSupportSocket";
import { Spinner } from "@heroui/react";
import SupportMessageForm from "@/components/forms/supportMessageForm";
import { TagChip } from "@/components/ui/tag-chip";

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

const statusLabel = (s: string) =>
  s === "awaiting_admin" ? "Awaiting support" : s === "awaiting_client" ? "Awaiting you" : s.replace(/_/g, " ");

/** Reference-styled ticket thread: bordered 4px panel, gold client bubbles, navy support bubbles. */
export default function TicketDetail({ ticketId, onBack }: TicketDetailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ticket, isLoading } = useTicketDetails(ticketId);
  useSupportSocket(ticketId);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [ticket?.messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <motion.div variants={container_variants} initial="hidden" animate="visible" className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 h-6 text-[15px] leading-6 text-muted-foreground hover:text-foreground w-fit"
      >
        <Icon name="arrow-left-16" size={16} />
        Back
      </button>

      <div className="flex flex-col h-[calc(100dvh-220px)] min-h-[420px] rounded-[4px] border border-border overflow-hidden">
        <div className="h-16 px-4 border-b border-border flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-[18px] leading-6 font-medium text-foreground truncate">{ticket.subject}</h2>
            <p className="text-[12px] leading-4 text-muted-foreground">Ticket #{ticket.id}</p>
          </div>
          <TagChip tone={ticket.status === "awaiting_client" ? "positive" : "default"}>
            {statusLabel(ticket.status)}
          </TagChip>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scroll-smooth">
          <AnimatePresence mode="popLayout">
            {ticket.messages?.map((msg) => {
              const isClient = msg.sender_type === "client";
              return (
                <motion.div
                  key={msg.id}
                  variants={item_variants}
                  initial="hidden"
                  animate="visible"
                  className={cn("flex gap-2 md:gap-3 max-w-[85%]", isClient ? "ml-auto flex-row-reverse" : "mr-auto")}
                >
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0",
                      isClient ? "bg-primary text-black" : "bg-field text-muted-foreground"
                    )}
                  >
                    {isClient ? <Icon name="user-16" size={16} /> : <Icon name="verification-16" size={16} />}
                  </div>
                  <div className={cn("flex flex-col gap-1", isClient ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "px-4 py-2 rounded-[4px] text-[15px] leading-6 flex flex-col gap-2",
                        isClient ? "bg-primary text-black" : "bg-field text-foreground"
                      )}
                    >
                      {msg.message && <p className="whitespace-pre-wrap">{msg.message}</p>}
                      {msg.attachment_url && (
                        <div
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-[4px] text-[12px] leading-4",
                            isClient ? "bg-black/10" : "bg-background"
                          )}
                        >
                          <Icon name="document-16" size={16} />
                          <span className="truncate max-w-[150px]">{msg.attachment_filename}</span>
                          <a href={msg.attachment_url} download={msg.attachment_filename} className="ml-2 underline">
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                    <p className="text-[12px] leading-4 text-muted-foreground px-1">
                      {formatIST(msg.created_at, { hour: "2-digit", minute: "2-digit", hour12: false })} •{" "}
                      {isClient ? "You" : "Support Team"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-border">
          <SupportMessageForm ticketId={ticketId} />
        </div>
      </div>
    </motion.div>
  );
}
