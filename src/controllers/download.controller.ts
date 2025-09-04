import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

interface File {
  type: string;
  url: string;
}

export const downloadController = {
  createBeatDownload: async (req: Request, res: Response) => {
    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.purchaseId },
      include: { license: true, beat: { include: { files: true } } },
    });

    if (!purchase || purchase.status !== "paid") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Explicitly type filesToDownload as an array of File
    let filesToDownload: File[] = [];
    if (purchase.license.type === "Basic") {
      filesToDownload = purchase.beat.files.filter((f) => f.type === "mp3");
    } else if (purchase.license.type === "Unlimited") {
      filesToDownload = purchase.beat.files.filter((f) =>
        ["mp3", "wav"].includes(f.type)
      );
    } else if (purchase.license.type === "Exclusive") {
      filesToDownload = purchase.beat.files;
    }

    // Return signed URLs (presigned S3 links)
    const signedUrls = filesToDownload.map((f) => ({
      type: f.type,
      //   url: getPresignedUrl(f.url), // implement with AWS SDK
    }));

    res.json(signedUrls);
  },
};
