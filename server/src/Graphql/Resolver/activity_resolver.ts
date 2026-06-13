import GraphQLJSON from "graphql-type-json";
import { GetActivityLogsByProjectService } from "../../Services/activitylogs.js";

type GetActivityLogsByProjectArgs = {
  project_id: string;
};

export const activityLogResolver = {
  JSON: GraphQLJSON,

  Query: {
    GetActivityLogsByProject: async (
      _: unknown,
      args: GetActivityLogsByProjectArgs
    ) => {
      return await GetActivityLogsByProjectService(args.project_id);
    },
  },
};