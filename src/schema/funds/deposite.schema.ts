import { z } from "zod";

export const depositeSchema = z.object({
    paymentMethod: z.string().min(1, "Payment method is required"),
    payment_mode: z.string().min(1, "Payment mode is required"),
    payment_option_id : z.string().min(1, "Payment method is required"),
    to: z.string().min(1, "To is required"),
    from: z.string().min(1, "From is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    receiveAmount: z.number().min(10, "Receive amount must be greater than 10"),
    // Proof images: up to 5 (jpg/png/webp, 5 MB each - checked in ProofImagesUpload and on the server)
    file: z.array(z.instanceof(File)).max(5, "You can upload at most 5 images").optional()
})
export const depositeWithCoinsbaySchema = z.object({
    paymentMethod: z.string().min(1, "Payment method is required"),
    payment_mode: z.string().min(1, "Payment mode is required"),
    payment_option_id : z.string().min(1, "Payment method is required"),
    to: z.string().min(1, "To is required"),
    from: z.string().min(1, "From is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    receiveAmount: z.number().min(10, "Receive amount must be greater than 10"),
    // file: z.instanceof(File).optional()
})




export type depositeSchemaType = z.infer<typeof depositeSchema>