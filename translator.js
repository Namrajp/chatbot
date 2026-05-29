export async function translateToNepali(text, client) {
  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: `
Translate the following text to Nepali.

Text:
${text}
`,
  });

  return response.output_text;
}
