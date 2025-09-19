import { Router } from "express";
import { uploadControllers } from "../../controllers/kits/upload.controllers";

export const uploadRoutes = Router();

uploadRoutes.post("/presign", uploadControllers.getPresignedUrl);
