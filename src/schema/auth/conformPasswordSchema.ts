import { z } from "zod";

const conformPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    repeat_password: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.repeat_password, {
    message: "Passwords don't match",
    path: ["repeat_password"],
  });

export type conformPasswordSchemaType = z.infer<typeof conformPasswordSchema>;
export default conformPasswordSchema;
