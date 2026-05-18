import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "../types/index.js";

export function autenticar(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ erro: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string") {
      res.status(401).json({ erro: "Token inválido" });
      return;
    }

    (req as Request & { usuario: JwtPayload }).usuario = decoded as JwtPayload;

    next();
  } catch {
    res.status(401).json({ erro: "Token inválido" });
  }
}