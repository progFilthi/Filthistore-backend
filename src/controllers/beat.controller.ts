import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Define AuthRequest to match authMiddleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Define request body type for createBeat
interface CreateBeatRequestBody {
  title: string;
  key: string;
  bpm: number;
  price: number;
  producerId: string;
  licenses: { type: string; price: number }[];
  files: { type: string; url: string }[];
}

export const BeatController = {
  // Get a beat by ID
  getBeatById: async (req: Request, res: Response) => {
    try {
      const beat = await prisma.beat.findUnique({
        where: { id: req.params.id },
        include: { licenses: true, files: true },
      });
      if (!beat) {
        return res.status(404).json({ error: "Beat not found" });
      }
      res.json(beat);
    } catch (error: any) {
      console.error("Error fetching beat:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all beats
  getAllBeats: async (req: Request, res: Response) => {
    try {
      const beats = await prisma.beat.findMany({
        include: { licenses: true, files: true, producer: true },
      });
      res.json(beats);
    } catch (error: any) {
      console.error("Error fetching beats:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create a beat
  createBeat: async (req: AuthRequest, res: Response) => {
    try {
      // Validate request body
      const { title, key, bpm, price, producerId, licenses, files } =
        req.body as CreateBeatRequestBody;

      // Ensure required fields are provided
      if (
        !title ||
        !key ||
        !bpm ||
        !price ||
        !producerId ||
        !licenses ||
        !files
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Ensure the authenticated user is the producer
      if (!req.user || producerId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized to create beat" });
      }

      // Validate licenses and files
      if (!Array.isArray(licenses) || licenses.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one license is required" });
      }
      if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: "At least one file is required" });
      }

      // Create the beat
      const beat = await prisma.beat.create({
        data: {
          title,
          key,
          bpm,
          price,
          producerId,
          licenses: {
            create: licenses.map((l) => ({
              type: l.type as "Basic" | "Unlimited" | "Exclusive",
              price: l.price,
            })),
          },
          files: {
            create: files.map((f) => ({
              type: f.type as "mp3" | "wav" | "stems" | "image",
              url: f.url,
            })),
          },
        },
        include: { licenses: true, files: true },
      });

      res.status(201).json(beat);
    } catch (error: any) {
      console.error("Error creating beat:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
