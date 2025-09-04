import { Router } from "express";
import { downloadController } from "../controllers/download.controller";

export const downloadRoutes = Router();

downloadRoutes.get("/:purchaseId", downloadController.createBeatDownload);
