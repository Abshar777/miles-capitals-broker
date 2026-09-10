
import { z } from "zod";

// "source_login": 9530674,
// "destination_login": 9530679,
// "amount": 10,

export const mt5ToMt5TransferSchema = z.object({
    destination_login: z.string().min(1, "destination account login id is required"),
    source_login: z.string().min(1, "your account login id is required"),
    amount: z.number().min(10, "Amount must be greater than 0"),
    currency: z.string().min(1, "Currency is required"),
})

export type mt5ToMt5TransferSchemaType = z.infer<typeof mt5ToMt5TransferSchema>