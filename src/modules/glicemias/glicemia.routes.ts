import { Router } from "express";
import auth from "../../middleware/auth.middleware";

import {
  create,
  list,
  getOne,
  update,
  remove,
} from "./glicemia.controller";

const router = Router();

router.post("/", auth, create);
router.get("/", auth, list);
router.get("/:id", auth, getOne);
router.put("/:id", auth, update);
router.delete("/:id", auth, remove);

export default router;