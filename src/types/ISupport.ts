export interface TSupportMessage {
  id: string;
  ticket_id: string;
  sender_type: 'client' | 'admin';
  sender_id: string;
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
  attachment_url?: string;
  attachment_filename?: string;
  attachment_type?: string;
}
export interface TSupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: "open" | "closed" | "awaiting_admin" | "awaiting_client";
  created_at: string;
  updated_at: string;
  last_message_at: string;
  last_message_preview: string;
  last_sender: "client" | "admin";
  unread_client_count: number;
}

export interface TSupportTicketDetails extends TSupportTicket {
  messages: TSupportMessage[];
}

export interface TTicketListResponse {
  tickets: TSupportTicket[];
  total_count: number;
}

export interface TSupportActionResponse {
  message: string;
  status: string;
}
