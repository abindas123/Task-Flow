import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { expressMiddleware } from "@as-integrations/express5";
import { apolloServer } from "./Config/apolloserver.js";

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-flow-6ewcxftiv-abindas123s-projects.vercel.app",
];

await apolloServer.start();

app.get("/", (_req, res) => {
  res.send("Task Flow API is running");
});

app.use(
  "/graphql",
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || "";

      if (!authHeader) {
        return { user: null };
      }

      const token = authHeader.replace("Bearer ", "");

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string);

        return { user };
      } catch {
        return { user: null };
      }
    },
  })
);

app.get("/", (_req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`GraphQL server running on port ${PORT}`);
});