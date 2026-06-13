import { promises as fs } from "fs";
import path from "path";
import type { PushSubscription } from "web-push";
import type { AlertSettings } from "./types";

export interface StoredSubscription {
  subscription: PushSubscription;
  settings: AlertSettings;
  createdAt: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, "subscriptions.json");
const STATE_FILE = path.join(DATA_DIR, "alert-state.json");

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function getAllSubscriptions(): Promise<StoredSubscription[]> {
  return readJson<StoredSubscription[]>(SUBSCRIPTIONS_FILE, []);
}

export async function upsertSubscription(
  subscription: PushSubscription,
  settings: AlertSettings
): Promise<void> {
  const subscriptions = await getAllSubscriptions();
  const index = subscriptions.findIndex(
    (entry) => entry.subscription.endpoint === subscription.endpoint
  );
  const entry: StoredSubscription = {
    subscription,
    settings,
    createdAt: Date.now(),
  };
  if (index >= 0) {
    subscriptions[index] = entry;
  } else {
    subscriptions.push(entry);
  }
  await writeJson(SUBSCRIPTIONS_FILE, subscriptions);
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const subscriptions = await getAllSubscriptions();
  const next = subscriptions.filter(
    (entry) => entry.subscription.endpoint !== endpoint
  );
  if (next.length !== subscriptions.length) {
    await writeJson(SUBSCRIPTIONS_FILE, next);
  }
}

export async function getLastCheckTime(): Promise<number> {
  const state = await readJson<{ lastCheck?: number }>(STATE_FILE, {});
  return state.lastCheck ?? Date.now() - 5 * 60 * 1000;
}

export async function setLastCheckTime(timestamp: number): Promise<void> {
  await writeJson(STATE_FILE, { lastCheck: timestamp });
}
