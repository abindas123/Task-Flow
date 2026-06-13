import {
  CreateDependency,
  GetDependenciesByTask,
  DeleteDependency,
} from "../Db/Queries/dependency.js";

import { CreateActivityLogService } from "./activitylogs.js";
import { getProjectWorkspaceById } from "../Db/Queries/workspace.js";
import { Gettaskbyid } from "./tasks.js";

type Dependency = {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: "BLOCKED_BY";
  created_at: string;

  task_title?: string | null;
  depends_on_task_title?: string | null;
};

export async function CreateDependencyService(
  task_id: string,
  depends_on_task_id: string
): Promise<Dependency> {
  const dependency = await CreateDependency(task_id, depends_on_task_id);

  if (!dependency) {
    throw new Error("Error in creating dependency");
  }

  const blockedTask = await Gettaskbyid(task_id);

  if (!blockedTask) {
    throw new Error("Blocked task not found");
  }

  const blockingTask = await Gettaskbyid(depends_on_task_id);

  if (!blockingTask) {
    throw new Error("Blocking task not found");
  }

  const project = await getProjectWorkspaceById(blockedTask.project_id);

  if (!project) {
    throw new Error("Project not found");
  }

  await CreateActivityLogService(
    project.workspace_id,
    blockedTask.project_id,
    blockedTask.id,
    blockedTask.created_by,
    "DEPENDENCY_ADDED",
    {
      task_title: blockedTask.title,
      depends_on_task_title: blockingTask.title,
      task_id: blockedTask.id,
      depends_on_task_id: blockingTask.id,
    }
  );

  return dependency;
}

export async function GetDependenciesByTaskService(
  task_id: string
): Promise<Dependency[]> {
  const dependencies = await GetDependenciesByTask(task_id);

  return dependencies;
}

export async function DeleteDependencyService(id: string): Promise<Dependency> {
  const deletedDependency = await DeleteDependency(id);

  if (!deletedDependency) {
    throw new Error("Error in deleting dependency");
  }

  return deletedDependency;
}