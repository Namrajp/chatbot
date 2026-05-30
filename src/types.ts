import type OpenAI from "openai";

export const taskModes = ["ticket", "resume", "review", "translate", "summary"] as const;

export type TaskMode = (typeof taskModes)[number];

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  mode: TaskMode;
  content: string;
  createdAt: string;
}

export interface Conversation {
  sessionId: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ChatRequestBody {
  sessionId?: unknown;
  mode?: unknown;
  prompt?: unknown;
}

export type TaskHandler = (prompt: string, client: OpenAI) => Promise<string>;
