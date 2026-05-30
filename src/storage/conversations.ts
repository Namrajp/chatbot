import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ChatMessage, Conversation } from "../types.js";

type ConversationMap = Record<string, Conversation>;

const dataDirectory = path.resolve("data");
const dataFile = path.join(dataDirectory, "conversations.json");

let writeQueue = Promise.resolve();

async function readStore(): Promise<ConversationMap> {
  try {
    const raw = await readFile(dataFile, "utf8");
    return JSON.parse(raw) as ConversationMap;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function writeStore(store: ConversationMap): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const nextOperation = writeQueue.then(operation, operation);
  writeQueue = nextOperation.then(
    () => undefined,
    () => undefined,
  );
  return nextOperation;
}

export async function getConversation(sessionId: string): Promise<Conversation> {
  const store = await readStore();
  return (
    store[sessionId] ?? {
      sessionId,
      messages: [],
      updatedAt: new Date().toISOString(),
    }
  );
}

export async function appendMessages(
  sessionId: string,
  messages: ChatMessage[],
): Promise<Conversation> {
  return withWriteLock(async () => {
    const store = await readStore();
    const existing = store[sessionId] ?? {
      sessionId,
      messages: [],
      updatedAt: new Date().toISOString(),
    };

    const conversation = {
      ...existing,
      messages: [...existing.messages, ...messages],
      updatedAt: new Date().toISOString(),
    };

    store[sessionId] = conversation;
    await writeStore(store);
    return conversation;
  });
}

export async function deleteConversation(sessionId: string): Promise<void> {
  await withWriteLock(async () => {
    const store = await readStore();
    delete store[sessionId];
    await writeStore(store);
  });
}
