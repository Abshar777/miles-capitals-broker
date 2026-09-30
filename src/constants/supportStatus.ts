// Support ticket statuses. Must match the backend (TICKET_STATUSES + CHECK constraint on support_tickets.status).
export const TICKET_STATUSES = ["open", "in_progress", "awaiting_reply", "closed"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_reply: "Awaiting Reply",
  closed: "Closed",
};

export const ticketStatusLabel = (s?: string | null) =>
  (s && (TICKET_STATUS_LABEL as Record<string, string>)[s]) || (s ?? "").replace(/_/g, " ");
