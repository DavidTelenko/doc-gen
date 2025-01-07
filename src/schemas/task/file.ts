import { z } from "zod";
import { taskShema } from "./task";
import { taskConfigSchema } from "./config";

export const taskFileSchema = z.object({
  config: taskConfigSchema,
  task: taskShema,
});

export type TaskFile = z.infer<typeof taskFileSchema>;
