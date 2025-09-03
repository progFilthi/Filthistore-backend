import { Router } from "express";
import { BeatController } from "../controllers/beat.controller";
import { authMiddleware } from "../middleware/middleware";

export const beatRoutes = Router();

// GET /api/v1/beats
// List all beats with licenses + files (public)
beatRoutes.get("/", BeatController.getAllBeats);

// GET /api/beats/:id
// Get a beat by ID (public)
beatRoutes.get("/:id", BeatController.getBeatById);

// POST /api/beats
// Create a beat (auth required: producer uploads)
beatRoutes.post("/", authMiddleware, BeatController.createBeat);
