import "dotenv/config.js";
import OpenAI from "openai";
import { z } from "zod"; //validation library for structured output purpose
import { zodTextFormat } from "openai/helpers/zod";

// const API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI();

//outputSchema
const RiskSchema = z.object({
  title: z.string().describe("the actual title foe risk"),
  tags: z.array(z.string()).describe("3-4 tags for the risk"),
  score: z.number().min(1).max(5).describe("rsik level out of 5"),
});

const outputSchema = z.object({
  risk: z.array(RiskSchema).describe("array of risks"),
});

async function init() {
  const result = await client.responses.parse({
    model: "gpt-4.1-mini",
    text: {
      format: zodTextFormat(outputSchema, "risks"),
    },
    // input: "Hey, there learning about SDK versions",
    input: `
    Extract the risks from the following documents:

    The company is planning to launch a new mobile app by the end of the quarter. 
    The engineering team is under a tight deadline, 
    and there is limited time for quality assurance testing. 
    The current infrastructure includes several legacy systems that may not integrate cleanly with the new app.
    Sensitive customer data must be migrated to a new database, 
    creating risk of data loss and compliance issues.
    There is also a potential security risk due to unpatched third-party libraries.

    `,
  });
  console.log(result.output_parsed);
}

init();
