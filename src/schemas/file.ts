import { z } from "zod";
import { taskConfigSchema } from "./config";
import { taskShema } from "./task";

export const taskFileSchema = z.object({
  config: taskConfigSchema,
  task: taskShema,
});

export type TaskFile = z.infer<typeof taskFileSchema>;
