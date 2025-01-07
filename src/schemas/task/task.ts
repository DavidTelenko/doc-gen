import { z } from "zod";
import { replacementSchema } from "../replacement";
import { permissionSchema } from "./permission";

const baseTaskSchema = z.object({
  name: z.string(),
  replacements: replacementSchema.array().min(1),
  permissions: permissionSchema.array().optional(),
});

export type Task = z.infer<typeof baseTaskSchema> & {
  subtasks?: Task[];
};

export const taskShema: z.ZodType<Task> = baseTaskSchema.extend({
  subtasks: z.lazy(() => taskShema.array()).optional(),
});
