CREATE EXTENSION IF NOT EXISTS vector;
DO $$ BEGIN
  CREATE TYPE knowledge_source_type AS ENUM (
    'TASK',
    'COMMENT',
    'DEPENDENCY',
    'ACTIVITY_LOG'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,

  source_type knowledge_source_type NOT NULL,
  source_id UUID NOT NULL,

  content TEXT NOT NULL,
  embedding vector(1536),

  metadata_json JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(source_type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_workspace_id
ON knowledge_chunks(workspace_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_project_id
ON knowledge_chunks(project_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_task_id
ON knowledge_chunks(task_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_source
ON knowledge_chunks(source_type, source_id);