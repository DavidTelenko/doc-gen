import { google } from "googleapis";
import { authorize } from "./auth.ts";
import type { TaskConfig } from "@/schemas/task/config.ts";
import type { Replacement } from "@/schemas/replacement.ts";
import type { Task } from "@/schemas/task/task.ts";

google.options({ auth: await authorize() });

export const docs = google.docs("v1");
export const drive = google.drive("v3");

export const utilities = (config: TaskConfig) => ({
  toGoogleFormat: ({ from, to, caseSensitive }: Replacement) => ({
    replaceAllText: {
      replaceText: to,
      containsText: {
        text: from,
        matchCase: caseSensitive ?? config.caseSensitive,
      },
    },
  }),

  copyTemplate: async (task: Task, template: string, directory: string) =>
    await drive.files.copy({
      fileId: template,
      requestBody: {
        parents: [directory],
        name: task.name,
      },
    }),

  substituteTemplate: async function (template: string, task: Task) {
    return await docs.documents.batchUpdate({
      documentId: template,
      requestBody: {
        requests: task.replacements.map(this.toGoogleFormat),
      },
    });
  },

  createDirectory: async (parent: string, task: Task) =>
    await drive.files.create({
      requestBody: {
        name: task.name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parent],
      },
    }),
});
