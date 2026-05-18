import type { Request, Response, NextFunction } from "express";

export function erroMiddleware(
  erro: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor" });
}