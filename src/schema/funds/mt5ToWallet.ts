import { z } from "zod";

export const mt5ToWalletSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    account_id: z.string().min(1, "Account ID is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
})

export type mt5ToWalletSchemaType = z.infer<typeof mt5ToWalletSchema>