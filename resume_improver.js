import OpenAI from "openai";
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const resumeText = `
Worked as IT Support.
Helped users with computer problems.
Used Microsoft Office.
`;

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

console.log(response.output_text);