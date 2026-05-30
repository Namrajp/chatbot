import { model } from "../openaiClient.js";
import type { TaskHandler } from "../types.js";

export const translateToNepali: TaskHandler = async (text, client) => {
  const response = await client.responses.create({
    model,
    input: `
Translate the following text to Nepali.

Text:
${text}
`,
  });

  return response.output_text;
};
