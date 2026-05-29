import OpenAI from "openai";
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const textToSummarize = `
Docker lets you package an application with everything it needs to run,
including code, dependencies, and configuration. This makes it easier to
run the same app on different computers or servers without setup problems.
`;

const response = await client.responses.create({
  model: "gpt-5-mini",
  input: `
Summarize this text in 3 short bullet points:

${textToSummarize}
  `,
});

console.log(response.output_text);