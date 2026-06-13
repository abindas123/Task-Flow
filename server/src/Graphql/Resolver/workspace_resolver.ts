import {
  createWorkspaceService,
  getWorkspaceByIdService,
  addMemberService,
  getWorkspaceMembersService,
  getallWorkspaceservice,
} from "./../../Services/workspace.js";

type CreateWorkspaceArgs = {
  name: string;
  description: string;
  owner_id: string;
};

type AddMemberArgs = {
  workspace_id: string;
  user_id: string;
  role: string;
};

type GetWorkspaceByIdArgs = {
  id: string;
};

type GetWorkspaceMembersArgs = {
  workspace_id: string;
};

export const workspaceResolvers = {
  Query: {
    getWorkspaceById: async (_: unknown, args: GetWorkspaceByIdArgs) => {
      return await getWorkspaceByIdService(args.id);
    },

    getWorkspaceMembers: async (
      _: unknown,
      args: GetWorkspaceMembersArgs
    ) => {
      return await getWorkspaceMembersService(args.workspace_id);
    },
    getallworkspaces:async(
      _:unknown
    )=>{
      return await getallWorkspaceservice()
    }
  },

  Mutation: {
    createWorkspace: async (_: unknown, args: CreateWorkspaceArgs) => {
      const { name, description, owner_id } = args;
      return await createWorkspaceService(name, description, owner_id);
    },

    addMember: async (_: unknown, args: AddMemberArgs) => {
      const { workspace_id, user_id, role } = args;
      return await addMemberService(workspace_id, user_id, role);
    },
  },
};