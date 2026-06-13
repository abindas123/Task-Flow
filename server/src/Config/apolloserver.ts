import { ApolloServer } from "@apollo/server";
import { typeDefs } from "../Graphql/Schema/index.js";
import { resolvers } from "../Graphql/Resolver/index.js";

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});