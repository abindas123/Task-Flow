CREATE TABLE activitylogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    activity_type VARCHAR(30) NOT NULL CHECK (
        activity_type IN (
            'WORKSPACE_CREATED',
            'PROJECT_CREATED',
            'TASK_CREATED',
            'TASK_ASSIGNED',
            'TASK_STATUS_CHANGED',
            'COMMENT_ADDED',
            'DEPENDENCY_ADDED'
        )
    ),
    payload_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);