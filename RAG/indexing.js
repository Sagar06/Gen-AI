import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { load } from "tiktoken/load";
import { OpenAIEmbeddings } from "@langchain/openai"; //for creating VE
import { QdrantVectorStore } from "@langchain/qdrant";
import { ur } from "zod/locales";
import { url } from "zod";
import OpenAI from "openai";

async function generateVectorEmbedddindForFile(filepath) {
  //Load the content
  const loader = new PDFLoader(filepath); //pdf loader
  const document = await loader.load(); //to convert into text, written data page by page

  //Initial VE

  const client = new OpenAI();
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  //Store to QdrantDB
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings, //use the embedding model
    {
      url: "http://localhost:6333",
      collectionName: "langchainjs-testing",
    },
  );
  await vectorStore.addDocuments(document);
  //chunk will be done internally, as document is an array
  console.log(`All the documnets are indexed....`);
}

generateVectorEmbedddindForFile("software.pdf");
