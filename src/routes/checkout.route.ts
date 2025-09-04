import { Router } from "express";
import { checkoutHandler } from "@dodopayments/express";
import { checkOutController } from "../controllers/checkout.controller";

export const checkOutRoutes = Router();

checkOutRoutes.get(
  "/",
  checkoutHandler({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL!,
    environment: "test_mode",
    type: "static",
  })
  //no controller here since this is a static purchase we not getting anything from DB
);

//POST api/v1/checkouts
checkOutRoutes.post(
  "/",
  checkoutHandler({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    returnUrl: process.env.DODO_PAYMENTS_RETURN_URL!,
    environment: "test_mode",
    type: "dynamic", // since beat data comes from DB
  }),
  checkOutController.createCheckOut
);
