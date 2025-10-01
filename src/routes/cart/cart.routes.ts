import { Router } from "express";
import { cartController } from "../../controllers/cart/cart.controller";

export const cartRoutes = Router();

cartRoutes.get("/", cartController.getAllCartItems);
cartRoutes.get("/:itemId", cartController.getCartItem);
cartRoutes.post("/", cartController.createCart);
cartRoutes.put("/:itemId", cartController.updateCartItem);
cartRoutes.delete("/:itemId", cartController.deleteCartItem);
