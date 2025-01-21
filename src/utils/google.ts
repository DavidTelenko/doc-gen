import type { Replacement } from "@/schemas/replacement.ts";
import type { TaskConfig } from "@/schemas/config.ts";
import type { Permission } from "@/schemas/permission.ts";
import type { Task } from "@/schemas/task.ts";
import { google } from "googleapis";
import { authorize } from "./auth.ts";

google.options({ auth: await authorize() });

export const docs = google.docs("v1");
export const drive = google.drive("v3");

export const utilities = (config: TaskConfig) => ({
  formatReplacement: ({ from, to, caseSensitive }: Replacement) => ({
    replaceAllText: {
      replaceText: to,
      containsText: {
        text: from,
        matchCase: caseSensitive ?? config.caseSensitive,
      },
    },
  }),

  formatPermission: ({ email, role }: Permission) => ({
    emailAddress: email,
    role,
  }),

  addPermission: async function (task: Task, fileId: string) {
    if (!task.permissions) {
      return;
    }

    for (const permissionConfig of task.permissions) {
      const permission = await drive.permissions.create({
        fileId,
        requestBody: {
          type: "user",
          ...this.formatPermission(permissionConfig),
        },
      });

      if (!permission.data || !permission.data.id) {
        console.error("Failed to create permission: ", permissionConfig);
      }
    }
  },

  copyTemplate: async function (
    task: Task,
    template: string,
    directory: string,
  ) {
    const file = await drive.files.copy({
      fileId: template,
      requestBody: {
        parents: [directory],
        name: task.name,
      },
    });

    if (file.data.id) {
      await this.addPermission(task, file.data.id);
    }

    return file;
  },

  substituteTemplate: async function (template: string, task: Task) {
    return await docs.documents.batchUpdate({
      documentId: template,
      requestBody: {
        requests: task.replacements.map(this.formatReplacement),
      },
    });
  },

  createDirectory: async function (parent: string, task: Task) {
    const directory = await drive.files.create({
      requestBody: {
        name: task.name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parent],
      },
    });

    if (directory.data.id) {
      await this.addPermission(task, directory.data.id);
    }

    return directory;
  },
});
