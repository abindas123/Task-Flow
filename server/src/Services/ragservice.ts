import OpenAI from "openai";

import {
  createEmbedding,
  convertEmbeddingToPgVector,
} from "./embeddingservice.js";

import {
  searchKnowledgeChunksByProject,
  searchKnowledgeChunksByTask,
} from "../Db/Queries/knowledge.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

type KnowledgeChunk = {
  id: string;
  workspace_id: string;
  project_id: string | null;
  task_id: string | null;
  source_type: "TASK" | "COMMENT" | "DEPENDENCY" | "ACTIVITY_LOG";
  source_id: string;
  content: string;
  metadata_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  distance: string | number;
};

type RagSource = {
  source_type: string;
  source_id: string;
  content: string;
  metadata_json: string;
  distance: number;
};

type RagAnswer = {
  answer: string;
  sources: RagSource[];
};

function cleanQuestion(question: string) {
  return question.replace(/\s+/g, " ").trim();
}

function buildContext(chunks: KnowledgeChunk[]) {
  if (chunks.length === 0) {
    return "No relevant context was found.";
  }

  return chunks
    .map((chunk, index) => {
      return `
Source ${index + 1}
Type: ${chunk.source_type}
Content: ${chunk.content}
`;
    })
    .join("\n");
}

function buildSources(chunks: KnowledgeChunk[]): RagSource[] {
  return chunks.map((chunk) => ({
    source_type: chunk.source_type,
    source_id: chunk.source_id,
    content: chunk.content,
    metadata_json:  JSON.stringify(chunk.metadata_json || {}),
    distance: Number(chunk.distance),
  }));
}

async function generateAnswerFromChunks(
  question: string,
  chunks: KnowledgeChunk[]
): Promise<string> {
  const context = buildContext(chunks);

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
You are an AI assistant inside a project management app called Task Flow.

Answer the user's question using only the provided context.

Rules:
- Do not invent information.
- If the answer is not in the context, say you do not have enough information.
- Be concise and practical.
- Mention blockers, status, comments, dependencies, or activity logs when relevant.
- Give next actions when the question asks what to do next.
        `,
      },
      {
        role: "user",
        content: `
Question:
${question}

Relevant project context:
${context}
        `,
      },
    ],
  });

  const answer = response.choices[0]?.message?.content;

  if (!answer) {
    throw new Error("AI answer generation failed.");
  }

  return answer;
}

export async function askProjectAI(
  project_id: string,
  question: string
): Promise<RagAnswer> {
  const cleanedQuestion = cleanQuestion(question);

  if (!cleanedQuestion) {
    throw new Error("Question cannot be empty.");
  }

  const questionEmbedding = await createEmbedding(cleanedQuestion);
  const pgVector = convertEmbeddingToPgVector(questionEmbedding);

  const chunks = await searchKnowledgeChunksByProject(project_id, pgVector, 8);

  const answer = await generateAnswerFromChunks(cleanedQuestion, chunks);

  return {
    answer,
    sources: buildSources(chunks),
  };
}

export async function askTaskAI(
  task_id: string,
  question: string
): Promise<RagAnswer> {
  const cleanedQuestion = cleanQuestion(question);

  if (!cleanedQuestion) {
    throw new Error("Question cannot be empty.");
  }

  const questionEmbedding = await createEmbedding(cleanedQuestion);
  const pgVector = convertEmbeddingToPgVector(questionEmbedding);

  const chunks = await searchKnowledgeChunksByTask(task_id, pgVector, 8);

  const answer = await generateAnswerFromChunks(cleanedQuestion, chunks);

  return {
    answer,
    sources: buildSources(chunks),
  };
}