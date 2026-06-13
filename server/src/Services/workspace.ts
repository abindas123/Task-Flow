import { createWorkspace,addMember,getWorkspaceMembers,findWorkspaceById, getWorkspaces } from "../Db/Queries/workspace.js";
import { CreateActivityLogService } from "./activitylogs.js";

type Workspace={
id:string,
name:string,
description:string,
owner_id: string,
created_at: string,
updated_at: string
}
type WorkspaceMember={
id: string,
workspace_id: string,
user_id: string,
role: string,
joined_at: string,
name: string,
email: string

}

export async function createWorkspaceService(
    name:string,description:string,owner_id:string
): Promise<Workspace>{
    const workspace=await createWorkspace(name,description,owner_id)
    if(!workspace){
        throw new Error("Workspace creation failed")
    }
     await CreateActivityLogService(
    workspace.id,
    null,
    null,
    owner_id,
    "WORKSPACE_CREATED",
    {
      workspace_name: workspace.name,
      description: workspace.description,
    }
  )
    await addMember(workspace.id,owner_id,"MANAGER")
    return workspace
}

export async function getWorkspaceByIdService(id:string):Promise<Workspace>{
    const workspace=await findWorkspaceById(id)
    if(!workspace){
        throw new Error("Workspace not found")
    }
    return workspace
}

export async function addMemberService(workspace_id:string,user_id:string,role:string)
:Promise<WorkspaceMember>{
    const add=await addMember(workspace_id,user_id,role)
    if(!add){
        throw new Error("error in adding")
    }
    return add

}

export async function getWorkspaceMembersService(workspace_id:string){
    const get=await getWorkspaceMembers(workspace_id)
    if(!get){
        throw new Error("error in fetching")
    }
    return get
}
export async function getallWorkspaceservice(){
    const get=await getWorkspaces()
    return get
}