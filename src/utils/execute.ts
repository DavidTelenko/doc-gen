import type { TaskConfig } from "@/schemas/task/config.ts";
import type { TaskFile } from "@/schemas/task/file.ts";
import type { Task } from "@/schemas/task/task.ts";
import { utilities as googleUtilities } from "./google.ts";

const dryUtilities = (_config: TaskConfig) => ({
  copyTemplate: async (task: Task, _template: string, _directory: string) => {
    console.log(`${task.name}: Coping template file`);
    return { data: { id: "1" } };
  },

  substituteTemplate: async (_template: string, task: Task) => {
    console.log(`${task.name}: Substituting template file`);
    return { data: { id: "1" } };
  },

  createDirectory: async (_parent: string, task: Task) => {
    console.log(`${task.name}: Creating directory`);
    return { data: { id: "1" } };
  },
});

const utilities = {
  google: googleUtilities,
};

export const execute = async ({ config, task }: TaskFile) => {
  const utils = config.dryRun
    ? dryUtilities(config)
    : utilities[config.provider](config);

  const recurse = async (task: Task, template: string, directory: string) => {
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
