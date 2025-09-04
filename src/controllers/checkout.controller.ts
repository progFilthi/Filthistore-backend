import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const checkOutController = {
  createCheckOut: async (req: Request, res: Response) => {
    const { beatId, licenseId, userId } = req.body;

    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { beat: true },
    });
    if (!license) return res.status(404).json({ error: "License not found" });

    // Record pending purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId, // optional (guest checkout supported)
        beatId,
        licenseId,
        amount: license.price,
        currency: "USD",
        status: "pending",
        provider: "dodo",
        providerTxn: "TEMP", // replace in webhook
      },
    });

    res.json({ paymentLink: res.locals.payment.payment_link, purchase });
  },
};
