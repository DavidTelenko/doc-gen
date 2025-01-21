import { type TaskFile, taskFileSchema } from "@/schemas/file";
import { readFile } from "node:fs/promises";

const verifyTask = (task: unknown): TaskFile | undefined => {
  const { data, error } = taskFileSchema.safeParse(task);

  if (error) {
    console.error(error.format());
    return;
  }

  return data;
};

export const getTask = async () => {
  if (process.argv.length === 3) {
    const content = await readFile(process.argv[2]);
    const json = JSON.parse(content.toString());
    return verifyTask(json);
  }

  if (process.stdin.isTTY) {
    console.error("Program cannot be run in TTY mode");
    return;
  }

  return verifyTask(await process.stdin.reduce((a, e) => a + e, ""));
};
