import { Router } from "express";
import { webHookController } from "../controllers/webhook.controller";

export const webHookRoutes = Router();

// POST /api/webhooks/dodo
webHookRoutes.post("/dodo", webHookController.purchaseWebHook);
