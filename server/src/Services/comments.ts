import {Createcomment,Updatecomment,Deletecomment,Getcommentsbytask} from '../Db/Queries/comments.js'
import { CreateActivityLogService } from "./activitylogs.js";
import { getProjectWorkspaceById } from "../Db/Queries/workspace.js"
import { Gettaskbyid } from './tasks.js';

type comments={
    id:string,
    task_id:string,
    author_id:string,
    body:string,
    created_at:string,
    updated_at:string
}

export async function Createcommentservice(task_id:string,author_id:string,body:string):Promise<comments>{
    const createcomment=await Createcomment(task_id,author_id,body)
    if(!createcomment){
        throw new Error("error in creating comment")
    }
   
    const task = await Gettaskbyid(task_id);
      const project = await getProjectWorkspaceById(task.project_id);

  if (!project) {
    throw new Error("Project not found");
  }
  await CreateActivityLogService(
    project.workspace_id,
    task.project_id,
    task.id,
    author_id,
    "COMMENT_ADDED",
    {
      task_title: task.title,
      comment_id: createcomment.id,
     preview: createcomment.body.slice(0, 80),
    }
  );
    return createcomment

}

export async function Updatecommentservice(id:string,body:string):Promise<comments>{
    const upadtedcomment=await Updatecomment(id,body)
    if(!upadtedcomment){
        throw new Error("error in updating comment")
    }
    return upadtedcomment
}

export async function Deletecommentservice(id:string):Promise<comments>{
    const deleted=await Deletecomment(id)
    if(!deleted){
        throw new Error("error in deleting comment")
    }
    return deleted
}

export async function Getcommentsbytaskservice(id:string):Promise<comments[]>{
    const allcomments= await Getcommentsbytask(id)
    if(!allcomments){
        throw new Error("error in fetching comments")
    }
    return allcomments
}