import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../lib/prisma";
import {
  dodopayments,
  checkout,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";

export const dodoPayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  environment: "test_mode", // or "live_mode" for production
});

export const auth = betterAuth({
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
  plugins: [
    dodopayments({
      client: dodoPayments,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "pdt_8AO6o67d0kDKZhLuXsPVp",
              slug: "premium-plan",
            },
          ],
          successUrl: "http://localhost:3000/success",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
          onPayload: async (payload) => {
            if (
              typeof payload === "object" &&
              payload !== null &&
              "event_type" in payload
            ) {
              const p = payload as { event_type: string | undefined };
              console.log("Received webhook:", p.event_type);
            } else {
              console.log("Received webhook with unknown payload:", payload);
            }
          },
        }),
      ],
    }),
  ],
});
