import { Router } from "express";
import { autenticar } from "../middlewares/auth.middleware.js";
import {
  listar,
  criar,
  atualizar,
  deletar,
} from "../controllers/categorias.controller.js";

const router = Router();

router.get("/categorias", autenticar, listar);
router.post("/categorias", autenticar, criar);
router.put("/categorias/:id", autenticar, atualizar);
router.delete("/categorias/:id", autenticar, deletar);

export default router;