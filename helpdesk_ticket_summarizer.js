export async function summarizeTicket(ticket, client) {
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

  return response.output_text;
}
