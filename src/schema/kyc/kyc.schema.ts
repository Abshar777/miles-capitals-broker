import { z } from "zod";

export const kycSchema = z.object({
    identity_name: z.enum(["passport", "aadhar", "emirates"]),
    identity_front: z.instanceof(File).refine(f => f.size <= 2 * 1024 * 1024, "File must be less than 2MB"),
    identity_back: z.instanceof(File).refine(f => f.size <= 2 * 1024 * 1024, "File must be less than 2MB"),
    residency_name: z.enum(["proof_of_residency"]),
    residency_front: z.instanceof(File).refine(f => f.size <= 2 * 1024 * 1024, "File must be less than 2MB"),
    residency_back: z.instanceof(File).refine(f => f.size <= 2 * 1024 * 1024, "File must be less than 2MB"),
});

export type kycSchemaType = z.infer<typeof kycSchema>;