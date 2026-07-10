import "dotenv/config.js";
import OpenAI from "openai";
import { z } from "zod"; //validation library for structured output purpose
import { zodTextFormat } from "openai/helpers/zod";

// const API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI();

async function init() {
  const stream = await client.responses.create({
    model: "gpt-4.1-mini",
    // input: "Hey, there learning about SDK versions",
    input: [
      {
        role: "user",
        content: "Tell me story on Bangalore.",
      },
    ],
    stream: true,
  });

  //generator function
  for await (const event of stream) {
    if (event && event.delta) process.stdout.write(event.delta);
  }
}

init();
