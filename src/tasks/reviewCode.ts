import { model } from "../openaiClient.js";
import type { TaskHandler } from "../types.js";

export const reviewCode: TaskHandler = async (code, client) => {
  const response = await client.responses.create({
    model,
    input: `
Review this JavaScript code.

Provide:
1. Issues found
2. Suggested improvements
3. Improved version

Code:

${code}
`,
  });

  return response.output_text;
};
