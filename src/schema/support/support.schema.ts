import { z } from "zod";

export const raiseTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Please provide more details in your message"),
  attachment: z.instanceof(File).optional(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  attachment: z.instanceof(File).optional(),
});

export type RaiseTicketType = z.infer<typeof raiseTicketSchema>;
export type SendMessageType = z.infer<typeof sendMessageSchema>;
