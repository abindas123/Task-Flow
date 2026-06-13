import { db } from "../../Config/db.js";
type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";
export async function createProject(
    name:string,
    description:string|null|undefined,
    workspace_id:string,
    status:ProjectStatus,
    created_by:string

){
    const result=await db.query(
        `INSERT INTO projects (name,description,workspace_id,status,created_by)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
        `,[name,description??null,workspace_id,status,created_by]
    )
    return result.rows[0]
}

export async function updateProject(
    project_id:string,
    name:string,
    description:string|null,
    status:ProjectStatus
){
    const result=await db.query(
        `
        UPDATE projects
        SET 
        name=$1,
        description=$2,
        status=$3,
        updated_at=NOW()
        WHERE id=$4
        RETURNING *
        `,[name,description,status,project_id]
    )
    return result.rows[0]
}


export async function getProjectbyId(
    project_id:string
){
    const result=await db.query(
        `SELECT * FROM projects WHERE id=$1
        `,[project_id]
    )
    return result.rows[0]
}

export async function getProjectbyWorkspaceId(
    workspace_id:string
){
    const result=await db.query(
        `SELECT * FROM projects WHERE workspace_id=$1 ORDER BY created_at DESC
        `,[workspace_id]
    )
    return result.rows
}