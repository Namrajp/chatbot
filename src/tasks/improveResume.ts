import { model } from "../openaiClient.js";
import type { TaskHandler } from "../types.js";

export const improveResume: TaskHandler = async (resumeText, client) => {
  const response = await client.responses.create({
    model,
    input: `
Improve the following resume bullet points.

Requirements:
- Professional tone
- Action verbs
- ATS-friendly
- Maximum 3 bullet points

Resume:
${resumeText}
`,
  });

  return response.output_text;
};
