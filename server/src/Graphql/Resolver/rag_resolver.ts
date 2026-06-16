import { askProjectAI, askTaskAI } from "../../Services/ragservice.js";

export const ragResolver = {
  Query: {
    askProjectAI: async (
      _: unknown,
      args: { project_id: string; question: string }
    ) => {
      return await askProjectAI(args.project_id, args.question);
    },

    askTaskAI: async (
      _: unknown,
      args: { task_id: string; question: string }
    ) => {
      return await askTaskAI(args.task_id, args.question);
    },
  },
};