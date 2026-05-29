import OpenAI from "openai";
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const code = `
function add(a,b){
return a+b
}
`;

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

console.log(response.output_text);