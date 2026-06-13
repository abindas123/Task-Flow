import {
  Createtaskservice,
  Updatetaskservice,
  Updatetaskstatusservice,
  Gettaskbyid,
  Gettaskbyproject,
} from "../../Services/tasks.js";

type TaskStatus =
  | "BACKLOG"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "BLOCKED"
  | "DONE";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Createtaskargs = {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  project_id: string;
  assignee_id: string | null;
  due_date: string | null;
};

type Updatetaskargs = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  assignee_id: string | null;
  due_date: string | null;
};

type Updatetaskstatusargs = {
  id: string;
  status: TaskStatus;
};

type Gettaskbyidargs = {
  id: string;
};

type Gettasksbyprojectargs = {
  project_id: string;
};

export const taskresolver = {
  Query: {
    Gettaskbyid: async (_: unknown, args: Gettaskbyidargs) => {
      return await Gettaskbyid(args.id);
    },

    Gettasksbyproject: async (_: unknown, args: Gettasksbyprojectargs) => {
      return await Gettaskbyproject(args.project_id);
    },
  },

  Mutation: {
    Createtask: async (_: unknown, args: Createtaskargs, context: any) => {
      const userId = context.user?.userId;

      if (!userId) {
        throw new Error("Unauthorized");
      }

      return await Createtaskservice(
        args.title,
        args.description ?? null,
        args.status,
        args.priority,
        args.project_id,
        args.assignee_id ?? null,
        args.due_date ?? null,
        userId
      );
    },

    Updatetask: async (_: unknown, args: Updatetaskargs) => {
      return await Updatetaskservice(
        args.id,
        args.title,
        args.description ?? null,
        args.priority,
        args.assignee_id ?? null,
        args.due_date ?? null
      );
    },

    Updatetaskstatus: async (_: unknown, args: Updatetaskstatusargs) => {
      return await Updatetaskstatusservice(args.id, args.status);
    },
  },
};