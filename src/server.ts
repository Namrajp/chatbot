import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { client } from "./openaiClient.js";
import { deleteConversation, getConversation, appendMessages } from "./storage/conversations.js";
import { handlers } from "./tasks/index.js";
import { taskModes, type ChatMessage, type ChatRequestBody, type TaskMode } from "./types.js";

const app = express();
const preferredPort = Number(process.env.PORT) || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDirectory = path.join(__dirname, "..", "public");

function isTaskMode(value: unknown): value is TaskMode {
  return typeof value === "string" && taskModes.includes(value as TaskMode);
}

function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 120;
}

function createMessage(role: ChatMessage["role"], mode: TaskMode, content: string): ChatMessage {
  return {
    id: randomUUID(),
    role,
    mode,
    content,
    createdAt: new Date().toISOString(),
  };
}

app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicDirectory));

const jsonErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }

  return next(error);
};

app.use(jsonErrorHandler);

app.get("/api/conversations/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: "Session id is required." });
  }

  const conversation = await getConversation(sessionId);
  return res.json(conversation);
});

app.delete("/api/conversations/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: "Session id is required." });
  }

  await deleteConversation(sessionId);
  return res.status(204).send();
});

app.post("/api/chat", async (req, res) => {
  const { sessionId, mode, prompt } = req.body as ChatRequestBody;

  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ error: "Session id is required." });
  }

  if (!isTaskMode(mode)) {
    return res.status(400).json({
      error: "Choose a valid mode: ticket, resume, review, translate, or summary.",
    });
  }

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const userMessage = createMessage("user", mode, prompt.trim());
    const output = await handlers[mode](userMessage.content, client);
    const assistantMessage = createMessage("assistant", mode, output || "No response returned.");
    await appendMessages(sessionId, [userMessage, assistantMessage]);

    return res.json({
      sessionId,
      mode,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    return res.status(500).json({
      error: "The AI request failed. Check the server logs and try again.",
    });
  }
});

function listen(port: number): void {
  const server = app.listen(port, () => {
    console.log(`Chatbot server listening at http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT && port < 3010) {
      console.warn(`Port ${port} is in use. Trying ${port + 1}.`);
      listen(port + 1);
      return;
    }

    throw error;
  });
}

listen(preferredPort);
