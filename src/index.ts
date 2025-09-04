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

//this is for routes
import { beatRoutes } from "../src/routes/beat.route";
import { checkOutRoutes } from "./routes/checkout.route";
import { webHookRoutes } from "./routes/webhook.route";
import { downloadRoutes } from "./routes/download.route";

//For beats api endpoints
app.use("/api/v1/beats/", beatRoutes);

//For check out api endpoints
app.use("/api/v1/checkouts/", checkOutRoutes);

//For webhook api end points
app.use("/api/v1/webhooks/", webHookRoutes);

//For beat download api endpoints
app.use("/api/v1/downloads/", downloadRoutes);

//health check
app.get("/", (_, res) => {
  res.status(200).json({ Message: "Filthi store is running ..." });
});

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
