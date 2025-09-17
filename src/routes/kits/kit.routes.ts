import { Router } from "express";
import { kitControllers } from "../../controllers/kits/kit.controllers";

export const kitRoutes = Router();

kitRoutes.get("/", kitControllers.getAllkits);
kitRoutes.post("/", kitControllers.createKit);
