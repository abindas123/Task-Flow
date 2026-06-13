import {
  Createtask,
  updatetaskstatus,
  Updatetask,
  gettasksbyid,
  gettasksbyproject
} from '../Db/Queries/tasks.js';
import { getProjectWorkspaceById } from '../Db/Queries/workspace.js';
import { CreateActivityLogService } from "./activitylogs.js";

type taskstatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'BLOCKED' | 'DONE';
type priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

type tasks = {
  id: string;
  title: string;
  description: string | null;
  status: taskstatus;
  priority: priority;
  project_id: string;
  assignee_id: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export async function Createtaskservice(
  title: string,
  description: string | null,
  status: taskstatus,
  priority: priority,
  project_id: string,
  assignee_id: string | null,
  due_date: string | null,
  created_by: string
):Promise<tasks> {
  const task = await Createtask(
    title,
    description,
    status,
    priority,
    project_id,
    assignee_id,
    due_date,
    created_by
  );

  if (!task) {
    throw new Error("error in creating task");
  }
  const project = await getProjectWorkspaceById(task.project_id);

  if (!project) {
    throw new Error("Project not found");
  }

  await CreateActivityLogService(
    project.workspace_id,
    task.project_id,
    task.id,
    task.created_by,
    "TASK_CREATED",
    {
      task_title: task.title,
      status: task.status,
      priority: task.priority,
      assignee_id: task.assignee_id,
      due_date: task.due_date,
    }
  )

  return task;
}

export async function Updatetaskservice(
  id: string,
  title: string,
  description: string | null,
  priority: priority,
  assignee_id: string | null,
  due_date: string | null
):Promise<tasks> {
  const updatedtask = await Updatetask(
    id,
    title,
    description,
    priority,
    assignee_id,
    due_date
  );

  if (!updatedtask) {
    throw new Error("error in updating task");
  }

  return updatedtask;
}

export async function Updatetaskstatusservice(
  id: string,
  status: taskstatus
): Promise<tasks> {
  const oldTask = await Gettaskbyid(id);

  if (!oldTask) {
    throw new Error("Task not found");
  }

  const updatedTask = await updatetaskstatus(id, status);

  if (!updatedTask) {
    throw new Error("error in updating task status");
  }

  const project = await getProjectWorkspaceById(updatedTask.project_id);

  if (!project) {
    throw new Error("Project not found");
  }

  await CreateActivityLogService(
    project.workspace_id,
    updatedTask.project_id,
    updatedTask.id,
    updatedTask.created_by,
    "TASK_STATUS_CHANGED",
    {
      task_title: updatedTask.title,
      old_status: oldTask.status,
      new_status: updatedTask.status,
    }
  );

  return updatedTask;
}

export async function Gettaskbyid(id: string):Promise<tasks> {
  const task = await gettasksbyid(id);

  if (!task) {
    throw new Error("error in fetching task");
  }

  return task;
}

export async function Gettaskbyproject(project_id: string):Promise<tasks[]> {
  const tasks = await gettasksbyproject(project_id);
  return tasks;
}