import OpenAI from "openai";
import 'dotenv/config';
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await client.responses.create({
  model: "gpt-5",
  input: "Explain Claude in simple terms"
});

console.log(response.output_text);