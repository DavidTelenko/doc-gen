import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import type { OAuth2Client } from "google-auth-library";

export const SCOPES = [
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
];
export const TOKEN_PATH = join(cwd(), "secrets/token.json");
export const CREDENTIALS_PATH = join(cwd(), "secrets/credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 */
export async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content.toString());
    return google.auth.fromJSON(credentials);
  } catch (error) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 */
export async function saveCredentials(refreshToken: string) {
  const content = await fs.readFile(CREDENTIALS_PATH);

  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;

  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: refreshToken,
  });

  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 */
export async function authorize(): Promise<OAuth2Client> {
  const savedClient = await loadSavedCredentialsIfExist();

  if (savedClient) {
    return savedClient as OAuth2Client;
  }

  const newClient = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (newClient.credentials.refresh_token) {
    await saveCredentials(newClient.credentials.refresh_token);
  }

  return newClient;
}
