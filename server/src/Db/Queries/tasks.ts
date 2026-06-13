import { db } from "../../Config/db.js";
type taskstatus='BACKLOG'| 'TODO'| 'IN_PROGRESS'| 'IN_REVIEW'| 'BLOCKED'| 'DONE'
type priority = 'LOW'| 'MEDIUM'| 'HIGH'| 'URGENT'

export async function Createtask(title:string,
    description:string|null,
    status:taskstatus,
    priority:priority,
    project_id:string,
    assignee_id:string|null,
    
    due_date:string|null,
    created_by:string){
        const result=await db.query(`
            INSERT INTO tasks(title,description,status,priority,project_id,assignee_id,due_date,created_by)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
            
            `,[title,description,status,priority,project_id,assignee_id,due_date,created_by]
        )
        return result.rows[0]

}

export async function Updatetask(
    id:string,
    title:string,
    description:string|null,
    priority:priority,
    assignee_id:string|null,
    due_date:string|null
){
    const result=await db.query(
        ` UPDATE tasks SET title=$1,description=$2,priority=$3,assignee_id=$4,due_date=$5
            WHERE id=$6 RETURNING *        
        `,[title,description,priority,assignee_id,due_date,id]
    )
    return result.rows[0]

}

export async function updatetaskstatus(id:string,status:taskstatus){

    const result=await db.query(
        `UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *
        `,[status,id]
    )
    return result.rows[0]
}

export async function gettasksbyid(id:string){
    const result=await db.query(`
        SELECT * FROM tasks WHERE id=$1
        `,[id]
    )
    return result.rows[0]
}

export async function gettasksbyproject(project_id:string){
    const result=await db.query(`
        SELECT * FROM tasks WHERE project_id=$1
        `,[project_id])
        return result.rows
}