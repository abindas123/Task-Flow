import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEmbedding(text: string): Promise<number[]> {
  const cleanedText = text.replace(/\s+/g, " ").trim();

  if (!cleanedText) {
    throw new Error("Cannot create embedding for empty text.");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in .env file.");
  }

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: cleanedText,
    encoding_format: "float",
  });

  const embedding = response.data[0]?.embedding;

  if (!embedding) {
    throw new Error("Embedding generation failed.");
  }

  return embedding;
}

export function convertEmbeddingToPgVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}