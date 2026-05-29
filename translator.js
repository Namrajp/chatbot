import OpenAI from "openai";
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const text = `
Hello, how are you?
I am learning the OpenAI API.
`;

const response = await client.responses.create({
  model: "gpt-5-mini",
  input: `
Translate the following text to Nepali.

Text:
${text}
`,
});

console.log(response.output_text);