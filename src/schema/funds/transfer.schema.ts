import { z } from "zod";

export const transferSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
   
    amount: z.number().min(1, "Amount must be greater than 0"),
    account_id: z.string().min(1, "Account ID is required"),
})

export type transferSchemaType = z.infer<typeof transferSchema>