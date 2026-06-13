import {
  CreateDependencyService,
  GetDependenciesByTaskService,
  DeleteDependencyService
} from "../../Services/dependency.js";

type CreateDependencyArgs = {
  task_id: string;
  depends_on_task_id: string;
};

type DeleteDependencyArgs = {
  id: string;
};

type GetDependenciesByTaskArgs = {
  task_id: string;
};

export const dependencyResolver = {
  Query: {
    GetDependenciesByTask: async (
      _: unknown,
      args: GetDependenciesByTaskArgs
    ) => {
      return await GetDependenciesByTaskService(args.task_id);
    }
  },

  Mutation: {
    CreateDependency: async (
      _: unknown,
      args: CreateDependencyArgs
    ) => {
      return await CreateDependencyService(
        args.task_id,
        args.depends_on_task_id
      );
    },

    DeleteDependency: async (
      _: unknown,
      args: DeleteDependencyArgs
    ) => {
      return await DeleteDependencyService(args.id);
    }
  }
};