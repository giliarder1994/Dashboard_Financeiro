import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import transacoesRouter from "./routes/transacoes.routes.js";
import { erroMiddleware } from "./middlewares/erro.middleware.js";
const app = express();
const porta = Number(process.env.PORT) || 3000;
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(categoriasRouter);
app.use(transacoesRouter);
app.use(erroMiddleware);
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
//# sourceMappingURL=app.js.map