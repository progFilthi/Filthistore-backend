import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const kitControllers = {
  getAllkits: async (_: Request, res: Response) => {
    try {
      const kits = await prisma.kit.findMany();
      res.status(200).json({ kits: kits });
    } catch (error) {
      console.error("Internal server error while fetching kits", error);
      res
        .status(500)
        .json({ Message: "Internal server error while fetching kits" });
    }
  },
  createKit: async (req: Request, res: Response) => {
    try {
      const { title, description, price, audioKey, imageKey } = req.body;

      if (!title || !price || !audioKey || !imageKey)
        return res.status(400).json({
          Message: "Title, price, audioKey & imageKey are required",
        });

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

      res.status(201).json({ Message: "Kit created successfully", kit });
    } catch (error) {
      console.error("Internal server error while creating a kit", error);
      res.status(500).json({ Message: "Internal server error" });
    }
  },
};
