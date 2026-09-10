import { mt5Leverage, mt5Products } from "@/constants/mt5.const";
import { z } from "zod";

export const mt5Schema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().optional(),
    leverage: z.enum(mt5Leverage.map((leverage) => leverage.value) as [string, ...string[]]),
    // product: z.enum(mt5Products.map((product) => product.value) as [string, ...string[]]),
    account_type: z.string().optional(),
    currency: z.string().min(1, "Currency is required"),
    initial_balance: z.number().min(0).optional(),
});

export type mt5SchemaType = z.infer<typeof mt5Schema>;