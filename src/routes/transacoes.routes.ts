import { Router } from "express";
import { autenticar } from "../middlewares/auth.middleware.js";
import {
  listar,
  criar,
  atualizar,
  deletar,
  resumo,
  mensal,
} from "../controllers/transacoes.controller.js";

const router = Router();

router.get("/transacoes", autenticar, listar);
router.get("/transacoes/resumo", autenticar, resumo);
router.get("/transacoes/mensal", autenticar, mensal);
router.post("/transacoes", autenticar, criar);
router.put("/transacoes/:id", autenticar, atualizar);
router.delete("/transacoes/:id", autenticar, deletar);

export default router;