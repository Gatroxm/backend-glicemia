import { Router } from "express";
import { login, register } from "./auth.controller";
import admin from "../../middleware/admin.middleware";

const router = Router();

router.post("/register", admin, register);
router.post("/login", login);

export default router;