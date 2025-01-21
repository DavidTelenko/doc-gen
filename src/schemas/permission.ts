import { z } from "zod";

export const permissionSchema = z.object({
  email: z.string().email(),
  role: z.enum(["writer", "reader", "commenter"]),
});

export type Permission = z.infer<typeof permissionSchema>;
