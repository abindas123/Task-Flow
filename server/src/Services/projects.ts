import {createProject,getProjectbyId,getProjectbyWorkspaceId,updateProject} from "../Db/Queries/projects.js"
import { CreateActivityLogService } from "./activitylogs.js";

type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";

type Project = {
  id: string;
  name: string;
  description: string | null;
  workspace_id: string;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export async function createProjectService(
  name: string,
  description: string | null,
  workspace_id: string,
  status: ProjectStatus,
  created_by: string
): Promise<Project> {
  const project = await createProject(
    name,
    description,
    workspace_id,
    status,
    created_by
  );

  if (!project) {
    throw new Error("Error creating project");
  }
await CreateActivityLogService(
    project.workspace_id,
    project.id,
    null,
    project.created_by,
    "PROJECT_CREATED",
    {
      project_name: project.name,
      description: project.description,
      status: project.status,
    }
  );
  return project;
}

export async function getProjectByIdService(id: string): Promise<Project> {
  const project = await getProjectbyId(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function updateProjectService(
  id: string,
  name: string,
  description: string | null,
  status: ProjectStatus
): Promise<Project> {
  const updatedProject = await updateProject(id, name, description, status);

  if (!updatedProject) {
    throw new Error("Failed to update project");
  }

  return updatedProject;
}

export async function getProjectsByWorkspaceIdService(
  workspace_id: string
): Promise<Project[]> {
  const projects = await getProjectbyWorkspaceId(workspace_id);

  return projects;
}