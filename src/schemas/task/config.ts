import { z } from "zod";

export const taskConfigSchema = z.object({
  template: z.string(),
  directory: z.string(),
  caseSensitive: z.boolean().default(false),
  dryRun: z.boolean().default(false),
});

export type TaskConfig = z.infer<typeof taskConfigSchema>;
