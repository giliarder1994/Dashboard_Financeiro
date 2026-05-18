import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import pool from "../db.js";
import type { JwtPayload, Usuario } from "../types/index.js";


type ReqAuth = Request & { usuario: JwtPayload };


// POST /cadastrar
export async function cadastrar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nome, email, senha } = req.body as {
      nome?: string;
      email?: string;
      senha?: string;
    };

    if (!nome || !email || !senha) {
      res.status(400).json({ erro: "Nome, email e senha são obrigatórios" });
      return;
    }

    const hash = await bcrypt.hash(senha, 10);

    const [resultado] = await pool.promise().query<import("mysql2").ResultSetHeader>(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hash]
    );

    res.status(201).json({ id: resultado.insertId, nome, email });
  } catch (erro: unknown) {
    // mysql2 tipifica erros como QueryError (que tem `.code`)
    if (
      typeof erro === "object" &&
      erro !== null &&
      "code" in erro &&
      (erro as { code: string }).code === "ER_DUP_ENTRY"
    ) {
      res.status(409).json({ erro: "Email já cadastrado" });
      return;
    }
    next(erro);
  }
}


// POST /login
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, senha } = req.body as { email?: string; senha?: string };

    if (!email || !senha) {
      res.status(400).json({ erro: "Email e senha são obrigatórios" });
      return;
    }

    const [rows] = await pool.promise().query<import("mysql2").RowDataPacket[]>(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    const usuario = rows[0] as Usuario | undefined;

    if (!usuario) {
      res.status(401).json({ erro: "Email ou senha inválidos" });
      return;
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      res.status(401).json({ erro: "Email ou senha inválidos" });
      return;
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome } satisfies Omit<JwtPayload, "iat" | "exp">,
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (erro) {
    next(erro);
  }
}


// GET /perfil
export async function perfil(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = (req as ReqAuth).usuario;

    const [rows] = await pool.promise().query<import("mysql2").RowDataPacket[]>(
      "SELECT id, nome, email FROM usuarios WHERE id = ?",
      [id]
    );

    res.status(200).json(rows[0]);
  } catch (erro) {
    next(erro);
  }
}


// PUT /perfil — atualiza nome
export async function atualizarNome(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nome } = req.body as { nome?: string };

    if (!nome) {
      res.status(400).json({ erro: "Nome é obrigatório" });
      return;
    }

    await pool.promise().query(
      "UPDATE usuarios SET nome = ? WHERE id = ?",
      [nome, (req as ReqAuth).usuario.id]
    );

    res.status(200).json({ mensagem: "Nome atualizado com sucesso" });
  } catch (erro) {
    next(erro);
  }
}

// PUT /perfil/senha — atualiza senha
export async function atualizarSenha(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { senhaAtual, novaSenha } = req.body as {
      senhaAtual?: string;
      novaSenha?: string;
    };

    if (!senhaAtual || !novaSenha) {
      res.status(400).json({ erro: "Preencha todos os campos" });
      return;
    }

    const [rows] = await pool.promise().query<import("mysql2").RowDataPacket[]>(
      "SELECT senha FROM usuarios WHERE id = ?",
      [(req as ReqAuth).usuario.id]
    );

    const senhaCorreta = await bcrypt.compare(senhaAtual, (rows[0] as { senha: string }).senha);

    if (!senhaCorreta) {
      res.status(401).json({ erro: "Senha atual incorreta" });
      return;
    }

    const hash = await bcrypt.hash(novaSenha, 10);

    await pool.promise().query(
      "UPDATE usuarios SET senha = ? WHERE id = ?",
      [hash, (req as ReqAuth).usuario.id]
    );

    res.status(200).json({ mensagem: "Senha atualizada com sucesso" });
  } catch (erro) {
    next(erro);
  }
}