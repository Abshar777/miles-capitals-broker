import { z } from "zod";







export const withdrawCashSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    collector_id_type: z.string().min(5, "Collector id type must be at least 5 characters long"),
    collector_id_number: z.string().min(10, "Collector id number must be at least 10 characters long"),
    collector_name: z.string().min(2, "Collector name must be at least 1 characters long"),
    collection_location: z.string().min(2, "Collection location must be at least 2 characters long"),
})


export const withdrawCryptoSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    network: z.string().min(1, "Network is required"),
    wallet_address: z.string().min(20, "Wallet address must be at least 20 characters long"),
})

export const withdrawBankTransferSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    bank_name: z.string().min(2, "Bank name must be at least 2 characters long"),
    account_number: z.string().min(2, "Account number is required"),
    account_holder_name: z.string().min(2, "Account holder name must be at least 5 characters long"),
    bank_swift_code: z.string().min(2, "Bank swift code must be at least 5 characters long").optional(),
    bank_routing_number: z.string().min(2, "Bank routing number must be at least 5 characters long").optional(),
    bank_ifsc_code: z.string().min(2, "Bank ifsc code must be at least 5 characters long"),
    bank_branch: z.string().min(2, "Bank branch must be at least 5 characters long"),
})


export const withdrawSchema = z.object({
    currency: z.string().min(1, "Currency is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    
})

export type withdrawSchemaType = z.infer<typeof withdrawCashSchema> | z.infer<typeof withdrawCryptoSchema> | z.infer<typeof withdrawBankTransferSchema>