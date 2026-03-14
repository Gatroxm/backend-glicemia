import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { generateExcel } from "./reportes.controller";

const router = Router();

router.get("/glicemias/excel", auth, generateExcel);

export default router;
