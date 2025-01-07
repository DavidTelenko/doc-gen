import { google } from "googleapis";
import { authorize } from "./auth.ts";

google.options({ auth: await authorize() });

export const docs = google.docs("v1");
export const drive = google.drive("v3");
