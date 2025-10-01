import type { Request, Response } from "express";
import { s3 } from "../../lib/s3-client";

export const uploadControllers = {
  getPresignedUrl: async (req: Request, res: Response) => {
    try {
      const { filename, contentType } = req.body;
      if (!filename || !contentType)
        return res
          .status(400)
          .json({ Message: "Filename & contentType are required" });
      const key = `uploads/${Date.now()}-${filename.replace(/\s+/g, "-")}`;

      const url = s3.presign(key, {
        method: "PUT",
        expiresIn: 3600,
        type: contentType,
        acl: "public-read",
      });
      res.status(200).json({ url, key });
    } catch (error) {
      console.error("Error generating presigned URL", error);
      res.status(500).json({ message: "Failed to generate presigned URL" });
    }
  },
};
