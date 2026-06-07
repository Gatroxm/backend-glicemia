import { Router } from "express";
import auth from "../../middleware/auth.middleware"; // Asegura si exportas default o nombrado

import {
  create,
  list,
  getOne,
  update,
  remove,
} from "./glicemia.controller";

const router = Router();

router.use(auth);

router.post("/", create);
router.get("/", list);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;