import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: API_KEY,
});

async function main() {
  const result = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
        what is 2+2 eqauls?
        Do not add anyhting else in answer, take samples from examples.
        Examples:
        - what is 5+4?
        Expected output: 9(Nine)
        - what is 10+20?
        Expected output: 30(thirty)
        `, //few shot example with example, with influence
      },
    ],
  });
  console.log(`Ans from OpenAI API:`, result.choices[0].message.content);
}

main();
