import OpenAI from "openai";

export const model = "gpt-5-mini";

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
