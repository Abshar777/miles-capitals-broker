import { z } from "zod";

const signUpSchema = z
  .object({
    firstname: z.string().min(2, "Name must contain at least 2 letters"),
    lastname: z.string().min(2, "Name must contain at least 2 letters"),
    phone: z.string().min(1, "Phone number is required").refine(
      (val) => {
        // Strip all spaces, then validate E.164-style: +{code}{local}, 7–15 digits total
        const cleaned = val.replace(/\s+/g, "");
        return /^\+\d{7,15}$/.test(cleaned);
      },
      { message: "Please enter a valid phone number" }
    ),
    country: z.string().min(2, "Country must contain at least 2 letters").optional(),
    city: z.string().min(2, "City must contain at least 2 letters").optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").
    // password must contain 1 lowercase, 1 uppercase, 1 digit, 1 special char and be 8+ chars
    refine((val) => {  
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_}{.+]).{8,}$/;
      return regex.test(val);
    }, {
      message: "Password must contain 1 lowercase, 1 uppercase, 1 digit, 1 special char and be 8+ chars",
    }),

    repeat_password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeat_password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["repeat_password"],
      });
    }

  });





export type signUpSchemaType = z.infer<typeof signUpSchema>;
export default signUpSchema;
