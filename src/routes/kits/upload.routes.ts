import { Router } from "express";
import { uploadControllers } from "../../controllers/kits/upload.controller";

export const uploadRoutes = Router();

uploadRoutes.post("/presign", uploadControllers.getPresignedUrl);
