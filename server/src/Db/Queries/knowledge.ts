import { db } from "../../Config/db.js";

export type KnowledgeSourceType =
  | "TASK"
  | "COMMENT"
  | "DEPENDENCY"
  | "ACTIVITY_LOG";

export type KnowledgeChunkInput = {
  workspace_id: string;
  project_id?: string | null;
  task_id?: string | null;
  source_type: KnowledgeSourceType;
  source_id: string;
  content: string;
  embedding: string;
  metadata_json?: Record<string, unknown>;
};

export async function upsertKnowledgeChunk(input: KnowledgeChunkInput) {
  const query = `
    INSERT INTO knowledge_chunks (
      workspace_id,
      project_id,
      task_id,
      source_type,
      source_id,
      content,
      embedding,
      metadata_json
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7::vector, $8::jsonb)
    ON CONFLICT (source_type, source_id)
    DO UPDATE SET
      workspace_id = EXCLUDED.workspace_id,
      project_id = EXCLUDED.project_id,
      task_id = EXCLUDED.task_id,
      content = EXCLUDED.content,
      embedding = EXCLUDED.embedding,
      metadata_json = EXCLUDED.metadata_json,
      updated_at = NOW()
    RETURNING *;
  `;

  const values = [
    input.workspace_id,
    input.project_id || null,
    input.task_id || null,
    input.source_type,
    input.source_id,
    input.content,
    input.embedding,
    JSON.stringify(input.metadata_json || {}),
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function deleteKnowledgeChunkBySource(
  source_type: KnowledgeSourceType,
  source_id: string
) {
  const query = `
    DELETE FROM knowledge_chunks
    WHERE source_type = $1
    AND source_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [source_type, source_id]);
  return result.rows[0];
}

export async function searchKnowledgeChunksByProject(
  project_id: string,
  embedding: string,
  limit = 8
) {
  const query = `
    SELECT
      id,
      workspace_id,
      project_id,
      task_id,
      source_type,
      source_id,
      content,
      metadata_json,
      created_at,
      updated_at,
      embedding <-> $2::vector AS distance
    FROM knowledge_chunks
    WHERE project_id = $1
    ORDER BY embedding <-> $2::vector
    LIMIT $3;
  `;

  const result = await db.query(query, [project_id, embedding, limit]);
  return result.rows;
}

export async function searchKnowledgeChunksByTask(
  task_id: string,
  embedding: string,
  limit = 8
) {
  const query = `
    SELECT
      id,
      workspace_id,
      project_id,
      task_id,
      source_type,
      source_id,
      content,
      metadata_json,
      created_at,
      updated_at,
      embedding <-> $2::vector AS distance
    FROM knowledge_chunks
    WHERE task_id = $1
    ORDER BY embedding <-> $2::vector
    LIMIT $3;
  `;

  const result = await db.query(query, [task_id, embedding, limit]);
  return result.rows;
}