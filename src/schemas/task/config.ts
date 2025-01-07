import { z } from "zod";

export const providerSchema = z.enum(["google"]);

export const taskConfigSchema = z.object({
  template: z.string(),
  directory: z.string(),
  caseSensitive: z.boolean().default(false),
  provider: providerSchema.default("google"),
  dryRun: z.boolean().default(false),
});

export type Provider = z.infer<typeof providerSchema>;

export type TaskConfig = z.infer<typeof taskConfigSchema>;
