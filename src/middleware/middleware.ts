import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

// Extend Request interface to match Prisma User model
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

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // Check if user exists
    if (!session?.user) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Normalize user object to match Prisma schema
    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      image: session.user.image ?? null,
      createdAt: new Date(session.user.createdAt),
      updatedAt: new Date(session.user.updatedAt),
    };

    // Proceed to next middleware/route
    next();
  } catch (error: any) {
    console.error("Error in auth middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
