import { db } from "../../Config/db.js";

export async function findWorkspaceById(id: string) {
  const result = await db.query(
    `SELECT id, name, description, owner_id, created_at, updated_at
     FROM workspaces
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

export async function createWorkspace(
  name: string,
  description: string,
  owner_id: string
) {
  const result = await db.query(
    `INSERT INTO workspaces (name, description, owner_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, description, owner_id, created_at`,
    [name, description, owner_id]
  );

  return result.rows[0];
}

export async function addMember(
  workspace_id: string,
  user_id: string,
  role: string
) {
  const result = await db.query(
    `INSERT INTO workspace_members (workspace_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING id, workspace_id, user_id, role, joined_at`,
    [workspace_id, user_id, role]
  );

  return result.rows[0];
}
export async function getProjectWorkspaceById(project_id: string) {
  const result = await db.query(
    `
    SELECT id, workspace_id
    FROM projects
    WHERE id = $1
    `,
    [project_id]
  );

  return result.rows[0];
}
export async function getWorkspaceMembers(workspace_id: string) {
  const result = await db.query(
    `SELECT wm.id,
            wm.workspace_id,
            wm.user_id,
            wm.role,
            wm.joined_at,
            u.name,
            u.email
     FROM workspace_members wm
     JOIN users u ON wm.user_id = u.id
     WHERE wm.workspace_id = $1`,
    [workspace_id]
  );

  return result.rows;
}

export async function getWorkspaces(){
  const result=await db.query(`
    SELECT * FROM workspaces
    `)
    return result.rows;
}