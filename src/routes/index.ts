import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import glicemiaRoutes from "../modules/glicemias/glicemia.routes";
import userRoutes from "../modules/users/users.routes";
import reportesRoutes from "../modules/reportes/reportes.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/glicemias", glicemiaRoutes);
router.use("/users", userRoutes);
router.use("/reportes", reportesRoutes);

export default router;