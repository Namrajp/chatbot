import { model } from "../openaiClient.js";
import type { TaskHandler } from "../types.js";

export const summarizeText: TaskHandler = async (textToSummarize, client) => {
  const response = await client.responses.create({
    model,
    input: `
Summarize this text in 3 short bullet points:

${textToSummarize}
`,
  });

  return response.output_text;
};
