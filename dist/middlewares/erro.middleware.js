export function erroMiddleware(erro, _req, res, _next) {
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
}
//# sourceMappingURL=erro.middleware.js.map