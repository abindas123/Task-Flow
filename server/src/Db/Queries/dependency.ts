import { db } from "../../Config/db.js";

export async function CreateDependency(
  task_id: string,
  depends_on_task_id: string
) {
  const result = await db.query(
    `
    INSERT INTO task_dependency (
      task_id,
      depends_on_task_id,
      dependency_type
    )
    VALUES ($1, $2, 'BLOCKED_BY')
    RETURNING *
    `,
    [task_id, depends_on_task_id]
  );

  return result.rows[0];
}

export async function GetDependenciesByTask(task_id: string) {
  const result = await db.query(
    `
    SELECT 
      td.id,
      td.task_id,
      td.depends_on_task_id,
      td.dependency_type,
      td.created_at,

      blocked_task.title AS task_title,
      blocking_task.title AS depends_on_task_title

    FROM task_dependency td

    JOIN tasks blocked_task
      ON blocked_task.id = td.task_id

    JOIN tasks blocking_task
      ON blocking_task.id = td.depends_on_task_id

    WHERE td.task_id = $1
       OR td.depends_on_task_id = $1

    ORDER BY td.created_at ASC
    `,
    [task_id]
  );

  return result.rows;
}

export async function DeleteDependency(id: string) {
  const result = await db.query(
    `
    DELETE FROM task_dependency
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}