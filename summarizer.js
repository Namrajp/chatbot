export async function summarizeText(textToSummarize, client) {
  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: `
Summarize this text in 3 short bullet points:

${textToSummarize}
`,
  });

  return response.output_text;
}
