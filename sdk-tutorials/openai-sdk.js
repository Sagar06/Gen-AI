import "dotenv/config.js";
import OpenAI from "openai";

// const API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI();

async function init() {
  const result = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "Hey, there learning about SDK versions",
  });
  console.log(result.output_text);
}

init();
 