import 'dotenv/config';
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ticket = `
User cannot connect to Wi-Fi.
Laptop shows connected but internet is unavailable.
Tried rebooting laptop and router.
Issue started this morning.
`;

const response = await client.responses.create({
  model: "gpt-5-mini",
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

console.log(response.output_text);