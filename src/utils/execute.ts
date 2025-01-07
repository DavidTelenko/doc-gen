import type { Task } from "@/schemas/task.ts";
import type { TaskFile } from "@/schemas/task/file.ts";
import type { Replacement } from "../schemas/replacement.ts";
import type { TaskConfig } from "@/schemas/task/config.ts";
import { docs, drive } from "./google.ts";

type id = string;

const utilities = (config: TaskConfig) => ({
  toGoogleFormat: ({ from, to, caseSensitive }: Replacement) => ({
    replaceAllText: {
      replaceText: to,
      containsText: {
        text: from,
        matchCase: caseSensitive ?? config.caseSensitive,
      },
    },
  }),

  copyTemplate: async (task: Task, template: id, directory: id) =>
    await drive.files.copy({
      fileId: template,
      requestBody: {
        parents: [directory],
        name: task.name,
      },
    }),

  substituteTemplate: async function (template: id, task: Task) {
    return await docs.documents.batchUpdate({
      documentId: template,
      requestBody: {
        requests: task.replacements.map(this.toGoogleFormat),
      },
    });
  },

  createDirectory: async (parent: id, task: Task) =>
    await drive.files.create({
      requestBody: {
        name: task.name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parent],
      },
    }),
});

const dryUtilities = (_config: TaskConfig) => ({
  copyTemplate: async (task: Task, _template: id, _directory: id) => {
    console.log(`${task.name}: Coping template file`);
    return { data: { id: "1" } };
  },

  substituteTemplate: async (_template: id, task: Task) => {
    console.log(`${task.name}: Substituting template file`);
    return { data: { id: "1" } };
  },

  createDirectory: async (_parent: id, task: Task) => {
    console.log(`${task.name}: Creating directory`);
    return { data: { id: "1" } };
  },
});

export const execute = async ({ config, task }: TaskFile) => {
  const utils = config.dryRun ? dryUtilities(config) : utilities(config);

  const recurse = async (task: Task, template: id, directory: id) => {
    if (!task.subtasks || task.subtasks?.length === 0) {
      const response = await utils.copyTemplate(task, template, directory);

      if (!response.data.id) {
        console.error(`Failed to copy template ${template} to ${directory}`);
        return;
      }

      await utils.substituteTemplate(response.data.id, task);
      return;
    }

    const response = await utils.createDirectory(directory, task);

    if (!response.data.id) {
      console.error(
        `Failed to create directory with name ${task.name} in parent folder ${directory}`,
      );
      return;
    }

    for (const subtask of task.subtasks) {
      subtask.replacements.push(...task.replacements);
      recurse(subtask, template, response.data.id);
    }
  };

  await recurse(task, config.template, config.directory);
};
