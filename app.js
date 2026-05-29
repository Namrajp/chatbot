import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { reviewCode } from "./code_reviewer.js";
import { summarizeTicket } from "./helpdesk_ticket_summarizer.js";
import { improveResume } from "./resume_improver.js";
import { summarizeText } from "./summarizer.js";
import { translateToNepali } from "./translator.js";

const app = express();
const preferredPort = Number(process.env.PORT) || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const handlers = {
  ticket: summarizeTicket,
  resume: improveResume,
  review: reviewCode,
  translate: translateToNepali,
  summary: summarizeText,
};

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }

  return next(error);
});

app.post("/api/chat", async (req, res) => {
  const { mode, prompt } = req.body ?? {};

  if (typeof mode !== "string" || !handlers[mode]) {
    return res.status(400).json({
      error: "Choose a valid mode: ticket, resume, review, translate, or summary.",
    });
  }

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const output = await handlers[mode](prompt.trim(), client);
    return res.json({ mode, output });
  } catch (error) {
    console.error("OpenAI request failed:", error);
    return res.status(500).json({
      error: "The AI request failed. Check the server logs and try again.",
    });
  }
});

function listen(port) {
  const server = app.listen(port, () => {
    console.log(`Chatbot server listening at http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT && port < 3010) {
      console.warn(`Port ${port} is in use. Trying ${port + 1}.`);
      listen(port + 1);
      return;
    }

    throw error;
  });
}

listen(preferredPort);
