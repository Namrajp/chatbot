import { model } from "../openaiClient.js";
import type { TaskHandler } from "../types.js";

export const summarizeTicket: TaskHandler = async (ticket, client) => {
  const response = await client.responses.create({
    model,
    input: `
Summarize this support ticket.

Return:
- Problem
- Actions Taken
- Suggested Next Step

Ticket:
${ticket}
`,
  });

  return response.output_text;
};
