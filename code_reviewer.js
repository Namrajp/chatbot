export async function reviewCode(code, client) {
  const response = await client.responses.create({
    model: "gpt-5-mini",
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
}
