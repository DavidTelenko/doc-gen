import { z } from "zod";

export const replacementSchema = z.object({
  from: z.string(),
  to: z.string(),
  caseSensitive: z.boolean().optional(),
});

export type Replacement = z.infer<typeof replacementSchema>;
