import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { expressMiddleware } from "@as-integrations/express5";
import { apolloServer } from "./Config/apolloserver.js";

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-flow-ochre-one.vercel.app",
  "https://task-flow-6ewcxftiv-abindas123s-projects.vercel.app",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

await apolloServer.start();

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Task Flow API is running");
});

app.use(
  "/graphql",
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

app.listen(PORT, () => {
  console.log(`GraphQL server running on port ${PORT}`);
});