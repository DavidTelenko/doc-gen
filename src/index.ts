import { getTask } from "./utils/get-task.ts";
import { execute } from "./utils/execute.ts";

await execute((await getTask()) ?? process.exit(1));
