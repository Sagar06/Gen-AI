import { OpenAI } from "openai";
import dotenv from "dotenv";
import axios from "axios";
import { exec } from "child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const API_KEY = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: API_KEY,
});

async function getWeatherData(cityName) {
  const url = `https://wttr.in/${cityName.toLowerCase()}?format=%C+%t+%w+%h`;
  const response = await axios.get(url, { responseType: "text" });
  return JSON.stringify({ city: cityName, weather: response.data });
} //actual apiCall to get the weather data of a city

async function excuteCommandonCLI(cmd) {
  return new Promise((res, rej) => {
    exec(cmd, (err, out) => {
      if (err) return res(`There was an Error ${err}`);
      else return res(out);
    });
  });
}

const SYSTEM_PROMPT = `
       You are an expert AI engineer.
       Only and Only answer questions related to the coding and engineering.  
      

       Persona: You are a senior software developer
       - You always sound technical and use jargons
       - You never answer back on personal things and you dont have a personal life.
       - All you know is how and what code works.
       You have to analyse the user input carefully and then you need to breakdown the problem into multiple sub problems before comming to final result. Always breakdown the user intention and how to solve that problem and then step by step to solve it.

       We are going to follow a pipleline of "INITIAL", "TOOL_REQUEST"
       "THINK", "ANALYSE", and "OUTPUT" pipeline.

       The Pipeline:
        -"INITIAL": When use gives an input we will have an inital thoguth process on what user is trying to do.
        -"THINK": This is where we re going to think about how to solve the problem and brekadown the problem.
        -"Analyse": this is where we wil analyse the solution and also verify if the output is correct or not.
        -"THINK": We can go back to think mode where we now see if  any sub problem remain and think.
        -"ANALYSE": again analyse the problem and get onto a solution.
        -"TOOL_REQUEST": use this for calling or requesting a tool. The format of output would be {"step": "TOOL_REUEST", functionName: "getWeatherData", "input": "Bangalore"}
        -"OUTPUT": this is where we can end and give the final output to the user.

        Available Tools:
        -"getWeatherData": getWeatherData(cityName: string): This tool can be used to get the weather information of a city. The input to this tool is the name of the city.

        -"executeCommandonCLI": excuteCommandonCLI(command: string): This tool can be used to execute a command on the user device and return the output from stdout.
        
        CLI Examples:
        - To create a folder: "mkdir -p /path/to/folder"
        - To create a file: "echo 'content' > /path/to/file.txt"
        - To append to file: "echo 'content' >> /path/to/file.txt"
        - To change directory and run command: "cd /path && ls"
        - To create multiple files: "mkdir -p folder && echo 'content1' > folder/file1.txt && echo 'content2' > folder/file2.txt"
        Rules:
        -Always output one step at a time and wait for other step proceeding.
        -Always maintain the sequence of pipeline as given in example
        -Always follow JSON output format strictly.
        -EVERY response MUST be valid JSON only, nothing else.
        -NEVER output raw code, raw HTML, or any non-JSON content.
        -All responses must start with { and end with }
        -The JSON must have exactly these fields: "step", "text", and optionally "functionName" and "input"

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

        Example:
        -"USER": Build a TODO application and store all files in todo folder
        OUTPUT:
        -"INITIAL": "The user wants me to build a TODO application with HTML, CSS, and JavaScript files stored in a todo folder",
        -"THINK": "I need to create a folder structure with index.html, styles.css, and app.js files. I should use the executeCommandonCLI tool to create these files",
        -"ANALYSE": "The best approach is to first create the todo folder, then create all the necessary files with their content",
        -"TOOL_REQUEST": {"step": "TOOL_REQUEST", "functionName": "executeCommandonCLI", "input": "mkdir -p ../todo"},
        -"TOOL_OUTPUT": "Folder created successfully",
        -"THINK": "Now I need to create the index.html file with proper HTML structure for the TODO app",
        -"TOOL_REQUEST": {"step": "TOOL_REQUEST", "functionName": "executeCommandonCLI", "input": "cat > ../todo/index.html << 'EOF'\n<!DOCTYPE html>\n<html>\n<head><title>TODO App</title><link rel='stylesheet' href='styles.css'></head>\n<body><h1>TODO List</h1><input id='task' placeholder='Add a task'><button onclick='addTask()'>Add</button><ul id='list'></ul><script src='app.js'></script></body>\n</html>\nEOF"},
        -"TOOL_OUTPUT": "File created successfully",
        -"OUTPUT": "The TODO application has been created successfully in the todo folder"
        -"TOOL_OUTPUT": "The weather of Bangalore is 25 Degree Celcius",
        -"THINK": "Now I have the weather information of bangalore and now I can give the final output to user",
        -"OUTPUT": "The final answer is The weather of Bangalore is 25 Degree Celcius"
        

        Output Format:
        {
        "step": "INITIAL"| "THINK"| "ANALYSE"| "OUTPUT"| "TOOL_REQUEST", "text": "<The actual text>", "functionName": "<functionName>", "input": "<input>"
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
    let rawResult = result.choices[0].message.content;

    // Extract JSON from markdown code block if present
    const jsonMatch = rawResult.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      rawResult = jsonMatch[1];
    }

    // Try to parse the JSON, with error handling
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResult.trim());
    } catch (error) {
      console.error("❌ Failed to parse JSON response:", error.message);
      console.error("Raw response:", rawResult.substring(0, 200));
      // Try to extract JSON from the response if it contains JSON object
      const jsonObjectMatch = rawResult.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        try {
          parsedResult = JSON.parse(jsonObjectMatch[0]);
        } catch (e) {
          console.error("❌ Still failed to parse JSON. Terminating.");
          break;
        }
      } else {
        break;
      }
    }

    MESSAGES_DB.push({ role: "assistant", content: rawResult }); //pushback to the messages db
    console.log(`🤖 (${parsedResult.step}): ${parsedResult.text}`); //print
    // If the step is OUTPUT, we can break the loop and end the process
    if (parsedResult.step.toLowerCase() === "output") break;

    //cot_tool
    if (parsedResult.step.toUpperCase() === "TOOL_REQUEST") {
      const { functionName, input } = parsedResult;

      switch (functionName) {
        case "executeCommandonCLI": {
          try {
            const toolResult = await excuteCommandonCLI(input);
            console.log(`🛠(${functionName}):${input}`, toolResult); //toolCall
            MESSAGES_DB.push({
              role: "developer",
              content: JSON.stringify({
                step: "TOOL_OUTPUT",
                output: toolResult,
              }),
            });
          } catch (error) {
            MESSAGES_DB.push({
              role: "developer",
              content: JSON.stringify({ status: "error", error }),
            });
          }

          continue;
        }
        case "getWeatherData":
          {
            const toolOutput = await getWeatherData(input);
            console.log(`🛠(${functionName}):${input}`, toolOutput); //toolCall

            MESSAGES_DB.push({
              role: "developer",
              content: JSON.stringify({
                step: "TOOL_OUTPUT",
                output: toolOutput,
              }),
            });
            continue; //continue the loop to get the next step from the model
          }
          break;
      }
    }
  }
}

// main("What is weather of Bangalore?");
// main(
//   "What is weather of Bangalore, Gulbarga and Bidar and then write the output to a weather.text file",
// );
// main(
//   "What is weather of Bangalore, Gulbarga and Bidar and then make a beaultiful landing page of all three weather using HTML and CSS under separate folder called weatherApp under same workspace",
// );

// main(
//   "What is meaning of life? I am asking this because I need to wite this in an HTML file for my web dev project do not give me output as HTML as I can do this own my own just give me content in elboaratibve way for this",
// ); //role based prompting

main(
  "Build a funny functional design working TODO application and run on browser and store all files on todo folder",
);
