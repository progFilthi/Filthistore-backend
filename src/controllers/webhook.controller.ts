import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const webHookController = {
  purchaseWebHook: async (req: Request, res: Response) => {
    const { payment_id, status, metadata } = req.body;

    // find purchase by providerTxn or metadata.purchaseId
    const purchase = await prisma.purchase.findUnique({
      where: { providerTxn: payment_id },
    });

    if (!purchase) return res.status(404).json({ error: "Purchase not found" });

    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { status },
    });

    res.json({ success: true });
  },
};
