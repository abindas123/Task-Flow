import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { expressMiddleware } from "@as-integrations/express5";
import { apolloServer } from "./Config/apolloserver.js";

const app = express();
const PORT = 5001;

await apolloServer.start();

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || "";

      if (!authHeader) {
        return { user: null };
      }

      const token = authHeader.replace("Bearer ", "");

      try {
        const user = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        );

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
  console.log(`GraphQL running at http://localhost:${PORT}/graphql`);
});