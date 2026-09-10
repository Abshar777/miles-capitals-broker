import { mt5Leverage, mt5Products } from "@/constants/mt5.const";
import { z } from "zod";

export const leverageSchema = z.object({
   
    leverage: z.enum(mt5Leverage.map((leverage) => leverage.value) as [string, ...string[]]),
});

export type leverageSchemaType = z.infer<typeof leverageSchema>;