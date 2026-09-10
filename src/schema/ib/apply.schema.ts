import { mt5Leverage, mt5Products } from "@/constants/mt5.const";
import { z } from "zod";

export const applyIBSchema = z.object({
    plan_id: z.string().min(1, "Plan ID is required"),
});

export const transferToMainSchema = z.object({
    amount: z.number().min(1, "Amount is required"),
});

export type applyIBSchemaType = z.infer<typeof applyIBSchema>;
export type transferToMainSchemaType = z.infer<typeof transferToMainSchema>;