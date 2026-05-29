export async function improveResume(resumeText, client) {
  const response = await client.responses.create({
    model: "gpt-5-mini",
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
}
