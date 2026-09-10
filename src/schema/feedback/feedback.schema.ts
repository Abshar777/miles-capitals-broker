import { z } from "zod";

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type FeedbackSchemaType = z.infer<typeof feedbackSchema>;
export default feedbackSchema;
