import { Router } from "express";
import admin from "../../middleware/admin.middleware";

import {
  updateUser,
  changeRole,
  listUsers,
} from "./users.controller";

const router = Router();

router.get("/", admin, listUsers);

router.put("/:id", admin, updateUser);

router.put("/role/:id", admin, changeRole);

export default router;