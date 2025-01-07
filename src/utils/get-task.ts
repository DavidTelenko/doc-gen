import { type TaskFile, taskFileSchema } from "@/schemas/task/file";

const parseTask = (task: unknown): TaskFile | undefined => {
  const { data, error } = taskFileSchema.safeParse(task);

  if (error) {
    console.error(error.format());
    return;
  }

  return data;
};

export const getTask = async () => {
  if (process.argv.length === 3) {
    return parseTask(await Bun.file(process.argv[2]).json());
  }

  if (process.stdin.isTTY) {
    console.error("Program cannot be run in TTY mode");
    return;
  }

  return parseTask(await process.stdin.reduce((a, e) => a + e, ""));
};
