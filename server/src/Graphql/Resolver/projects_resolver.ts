
import {
    createProjectService,
    updateProjectService,
    getProjectByIdService,
    getProjectsByWorkspaceIdService
} from '../../Services/projects.js'
type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";
type createProjectArgs={
    name:string,
    description:string|null,
     workspace_id:string,
    status:ProjectStatus,
   
}
type updateProjectArgs={
    id:string,
    name:string,
    description:string|null,
    status:ProjectStatus
}
type getProjectbyIdArgs={
    id:string

}
type getProjectbyWorkspaceIdArgs={
    workspace_id:string
}

export const Projectresolvers={
    Query:{
        getProjectById:async(_:unknown,args:getProjectbyIdArgs)=>{
            return await getProjectByIdService(args.id)
        },
        getProjectsByWorkspace:async(_:unknown,args:getProjectbyWorkspaceIdArgs)=>{
            return await getProjectsByWorkspaceIdService(args.workspace_id)
        }
    },
    Mutation:{
        createProject:async(_:unknown,args:createProjectArgs,context:any)=>{
            const userId = context.user?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }
            return await createProjectService(args.name,args.description??null,args.workspace_id,args.status,userId)
        },
        updateProject:async(_:unknown,args:updateProjectArgs)=>{
            return await updateProjectService(args.id,args.name,args.description??null,args.status)
        }
    }
}