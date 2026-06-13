
import { db } from "../../Config/db.js";


export async function Createcomment(task_id:string,author_id:string,body:string){

    const result=await db.query
    (`INSERT INTO comments (task_id,author_id,body)
        VALUES($1,$2,$3)
        RETURNING *
        
        
        `,[task_id,author_id,body])
        return result.rows[0]
}

export async function Deletecomment(id:string){
    const result=await db.query(
        `DELETE FROM comments WHERE id=$1 RETURNING *
        
        
        `,[id]
    )
    return result.rows[0]
}

export async function Updatecomment(id:string,body:string){
    const result=await db.query(
        `UPDATE comments SET body=$1 WHERE id=$2 RETURNING *
        
        `,[body,id]
    )
    return result.rows[0]
}

export async function Getcommentsbytask(task_id:string){
    const result=await db.query(
        `SELECT * FROM comments WHERE task_id=$1 
        `,[task_id]
    )
    return result.rows
}