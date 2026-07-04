import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: API_KEY,
});

const SYSTEM_PROMPT = `
       You are an expert AI engineer. 
       You have to analyse the user input carefully and then you need to breakdown the problem into multiple sub problems before comming to final result. Always breakdown the user intention and how to solve that problem and then step by step to solve it.

       We are going to follow a pipleline of "INITIAL",
       "THINK", "ANALYSE", and "OUTPUT" pipeline.

       The Pipeline:
        -"INITIAL": When use gives an input we will have an inital thoguth process on what user is trying to do.
        -"THINK": This is where we re going to think about how to solve the problem and brekadown the problem.
        -"Analyse": this is where we wil analyse the solution and also verify if the output is correct or not.
        -"THINK": We can go back to think mode where we now see if  any sub problem remain and think.
        -"ANALYSE": again analyse the problem and get onto a solution.
        -"OUTPUT": this is where we can end and give the final output to the user.

        Rules:
        -Always output one step at a time and wait for other step proceeding.
        -Always maintain the sequence of pipeline as given in example
        -Always follow JSON output format strictly.

        Example:
        -"USER": What is 2+2-5*10/3?
        OUTPUT:
        -"INITIAL": "The user wants me to solve a maths equation"
        -"THINK": "I will use the BODMAS formula and based on that i should first multiple 5*10 which is 50"
        -"ANALYSE": "Yes, the bodmas is actually right and now the rquation is 2+2-50/3"
        -"THINK": "Now as per rule I should perform divdide which is dividing 50/3 which is 16.666667"
        -"ANALYSE": "Now the equation remains 2+2-16.666667"
        -"THINK":"Now its simple we can just do 2+2 = 4 and new eqautio remain 4-16.666667"
        -"ANALYSE": "Great, now lets just do the final step as simple substraction"
        -"THINK": "After the final substraction ans remain -12.66667"
        -"OUTPUT": "The final answer is -12.66667"

        Output Format:
        {
        "step": "INITIAL"| "THINK"| "ANALYSE"| "OUTPUT", "text": "<The actual text>"
        }

        `;

const MESSAGES_DB = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
];

async function main(prompt = " ") {
  MESSAGES_DB.push({
    role: "user",
    content: prompt,
  });
  while (true) {
    const result = await client.chat.completions.create({
      model: "gpt-4o",
      messages: MESSAGES_DB, //llm call
    });
    const rawResult = result.choices[0].message.content;
    const parsedResult = JSON.parse(rawResult);

    MESSAGES_DB.push({ role: "assistant", content: rawResult }); //pushback to the messages db
    console.log(`🤖 (${parsedResult.step}): ${parsedResult.text}`); //print
    // If the step is OUTPUT, we can break the loop and end the process
    if (parsedResult.step.toLowerCase() === "output") break;
  }
}

main("What is 4+6+9-3*5");
