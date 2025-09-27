import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const kitControllers = {
  getAllkits: async (_: Request, res: Response) => {
    try {
      const kits = await prisma.kit.findMany();
      res.status(200).json({ kits });
    } catch (error) {
      console.error("Internal server error while fetching kits", error);
      res
        .status(500)
        .json({ message: "Internal server error while fetching kits" });
    }
  },

  getKit: async (req: Request, res: Response) => {
    try {
      const { kitId } = req.params;
      if (!kitId) return res.status(400).json({ message: "Kit ID is missing" });

      const kit = await prisma.kit.findUnique({ where: { id: kitId } });
      if (!kit) return res.status(404).json({ message: "Kit not found" });

      res.status(200).json({ kit });
    } catch (error) {
      console.error("Internal server error while fetching a kit", error);
      res
        .status(500)
        .json({ message: "Internal server error while fetching a kit" });
    }
  },

  createKit: async (req: Request, res: Response) => {
    try {
      const { title, description, price, audioKey, imageKey } = req.body;

      if (!title || !price || !audioKey || !imageKey) {
        return res.status(400).json({
          message: "Title, price, audioKey, and imageKey are required",
        });
      }

      const baseUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

      const kit = await prisma.kit.create({
        data: {
          title,
          description,
          price,
          audioUrl: `${baseUrl}/${audioKey}`,
          imageUrl: `${baseUrl}/${imageKey}`,
        },
      });

      res.status(201).json({ message: "Kit created successfully", kit });
    } catch (error) {
      console.error("Internal server error while creating a kit", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateKit: async (req: Request, res: Response) => {
    try {
      const { kitId } = req.params;
      const { title, description, price } = req.body;

      if (!kitId) return res.status(400).json({ message: "Kit ID is missing" });

      const kit = await prisma.kit.update({
        where: { id: kitId },
        data: {
          title,
          description,
          price,
        },
      });

      res.status(200).json({ message: "Kit updated successfully", kit });
    } catch (error) {
      console.error("Internal server error while updating a kit", error);
      res
        .status(500)
        .json({ message: "Internal server error while updating a kit" });
    }
  },

  deleteKit: async (req: Request, res: Response) => {
    try {
      const { kitId } = req.params;
      if (!kitId)
        return res.status(400).json({ message: "Kit ID is required" });

      const kit = await prisma.kit.delete({ where: { id: kitId } });
      res.status(200).json({ message: "Kit deleted successfully", kit });
    } catch (error) {
      console.error("Internal server error while deleting a kit", error);
      res
        .status(500)
        .json({ message: "Internal server error while deleting a kit" });
    }
  },
};
