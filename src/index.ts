import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();

//middleware for cors
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

//catch all route for better-auth sdk
app.all("/api/auth/*splat", toNodeHandler(auth));

//middleware for parsing into JSON
app.use(express.json());

//health check
app.get("/", (_, res) => {
  res.status(200).json({ Message: "Filthi store is running ..." });
});

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
