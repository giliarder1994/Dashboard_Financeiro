import { Router } from "express";
import { autenticar } from "../middlewares/auth.middleware.js";
import {
  cadastrar,
  login,
  perfil,
  atualizarNome,
  atualizarSenha,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/cadastrar", cadastrar);
router.post("/login", login);
router.get("/perfil", autenticar, perfil);
router.put("/perfil", autenticar, atualizarNome);
router.put("/perfil/senha", autenticar, atualizarSenha);

export default router;