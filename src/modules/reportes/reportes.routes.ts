import { Router } from "express";
import auth from "../../middleware/auth.middleware";
import { generateExcel } from "./reportes.controller";

const router = Router();

router.use(auth);


router.get("/glicemias/excel", generateExcel);

export default router;