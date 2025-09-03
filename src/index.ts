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

import { checkoutHandler } from "@dodopayments/express";

//creating a static product
app.get(
  "/api/v1/checkout",
  checkoutHandler({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
    environment: "test_mode",
    type: "static",
  })
);

//this is for dynamic products that u create with code
app.post(
  "/api/v1/checkout",
  checkoutHandler({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
    environment: "test_mode",
    type: "dynamic",
  })
);

//this is for routes
import { beatRoutes } from "../src/routes/beat.route";

//allows us to use one api and just separate the routes accordingly
app.use("/api/v1/beats/", beatRoutes);

//health check
app.get("/", (_, res) => {
  res.status(200).json({ Message: "Filthi store is running ..." });
});

const port = process.env.PORT || 8001;

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
