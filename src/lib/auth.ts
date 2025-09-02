import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../lib/prisma";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [organization()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:8000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
