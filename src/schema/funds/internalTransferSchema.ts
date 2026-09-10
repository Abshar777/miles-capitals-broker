import { z } from "zod";

export const internalTransferSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    destination_login: z.string().min(1, "Recipient email is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
})

export type internalTransferSchemaType = z.infer<typeof internalTransferSchema>