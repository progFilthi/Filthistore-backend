import { Router } from "express";
import { kitControllers } from "../../controllers/kits/kit.controller";

export const kitRoutes = Router();

kitRoutes.get("/", kitControllers.getAllkits);
kitRoutes.get("/:kitId", kitControllers.getKit);
kitRoutes.post("/", kitControllers.createKit);
kitRoutes.put("/:kitId", kitControllers.updateKit);
kitRoutes.delete("/kitId", kitControllers.deleteKit);
