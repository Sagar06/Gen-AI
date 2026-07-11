import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { SYSTEM_PROMPT } from "@langchain/community/experimental/graph_transformers/llm";
import OpenAI from "openai";

async function query(userQuery) {
  //Convert user query to VE
  //Initail the VE
  const client = new OpenAI();
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  //Search the vectors in qdtrant

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings, //use the embedding model
    {
      url: "http://localhost:6333",
      collectionName: "langchainjs-testing",
    },
  );
  //get similar vactors and chuck
  const vectorRetriver = vectorStore.asRetriever({
    k: 5,
  }); //max 5 pages(chuk)
  const results = await vectorRetriver.invoke(userQuery);
  //converts user query vector and search and give relevant result

  //feed those chunks to llm model and do a simple chat with userQuery function
  //system_prompt
  const SYSTEM_PROMPT = `
You are an expert in answering user query based on the provided context about the document. Do not answer anything beyond the document which is not provided.

Always also answer the user in short and tell on which page number that contenct is present/available.
User Documents:
${results.map((e) =>
  JSON.stringify({
    pageContent: e.pageContent,
    pageNumber: e.metadata.loc.pageNumber,
  }),
)}.join('\n\n')

`;

  //   console.log(SYSTEM_PROMPT); //search for any pages in docs
  const llmResponse = client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
      //what user has asked
    ],
  });
  console.log(`LLM Responses:`, (await llmResponse).choices[0].message.content);
}

query("What is Running Antivirus Software?");
