import { activityLogResolver } from "./activity_resolver.js";
import { Authresolver } from "./auth_resolver.js";
import { commentresolver } from "./comments_resolver.js";
import { dependencyResolver } from "./dependency_resolver.js";
import { Projectresolvers } from "./projects_resolver.js";
import { taskresolver } from "./tasks_resolver.js";
import { workspaceResolvers } from "./workspace_resolver.js";

export const resolvers = {
  Query: {
    ...(workspaceResolvers.Query || {}),
    ...(Projectresolvers.Query || {}),
    ...(taskresolver.Query||{}),...(commentresolver.Query||{}),...(dependencyResolver.Query||{}),...(activityLogResolver.Query||{})
  },
  Mutation: {
    ...(Authresolver.Mutation || {}),
    ...(workspaceResolvers.Mutation || {}),
    ...(Projectresolvers.Mutation || {}),
    ...(taskresolver.Mutation||{}),
    ...(commentresolver.Mutation||{}),
    ...(dependencyResolver.Mutation||{})
  }
};