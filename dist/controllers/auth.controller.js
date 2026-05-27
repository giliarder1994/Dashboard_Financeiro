import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
// POST /cadastrar
export async function cadastrar(req, res, next) {
    try {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            res.status(400).json({ erro: "Nome, email e senha são obrigatórios" });
            return;
        }
        const hash = await bcrypt.hash(senha, 10);
        const [resultado] = await pool.promise().query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, hash]);
        res.status(201).json({ id: resultado.insertId, nome, email });
    }
    catch (erro) {
        // mysql2 tipifica erros como QueryError (que tem `.code`)
        if (typeof erro === "object" &&
            erro !== null &&
            "code" in erro &&
            erro.code === "ER_DUP_ENTRY") {
            res.status(409).json({ erro: "Email já cadastrado" });
            return;
        }
        next(erro);
    }
}
// POST /login
export async function login(req, res, next) {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            res.status(400).json({ erro: "Email e senha são obrigatórios" });
            return;
        }
        const [rows] = await pool.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);
        const usuario = rows[0];
        if (!usuario) {
            res.status(401).json({ erro: "Email ou senha inválidos" });
            return;
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            res.status(401).json({ erro: "Email ou senha inválidos" });
            return;
        }
        const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (erro) {
        next(erro);
    }
}
// GET /perfil
export async function perfil(req, res, next) {
    try {
        const { id } = req.usuario;
        const [rows] = await pool.promise().query("SELECT id, nome, email FROM usuarios WHERE id = ?", [id]);
        res.status(200).json(rows[0]);
    }
    catch (erro) {
        next(erro);
    }
}
// PUT /perfil — atualiza nome
export async function atualizarNome(req, res, next) {
    try {
        const { nome } = req.body;
        if (!nome) {
            res.status(400).json({ erro: "Nome é obrigatório" });
            return;
        }
        await pool.promise().query("UPDATE usuarios SET nome = ? WHERE id = ?", [nome, req.usuario.id]);
        res.status(200).json({ mensagem: "Nome atualizado com sucesso" });
    }
    catch (erro) {
        next(erro);
    }
}
// PUT /perfil/senha — atualiza senha
export async function atualizarSenha(req, res, next) {
    try {
        const { senhaAtual, novaSenha } = req.body;
        if (!senhaAtual || !novaSenha) {
            res.status(400).json({ erro: "Preencha todos os campos" });
            return;
        }
        const [rows] = await pool.promise().query("SELECT senha FROM usuarios WHERE id = ?", [req.usuario.id]);
        const senhaCorreta = await bcrypt.compare(senhaAtual, rows[0].senha);
        if (!senhaCorreta) {
            res.status(401).json({ erro: "Senha atual incorreta" });
            return;
        }
        const hash = await bcrypt.hash(novaSenha, 10);
        await pool.promise().query("UPDATE usuarios SET senha = ? WHERE id = ?", [hash, req.usuario.id]);
        res.status(200).json({ mensagem: "Senha atualizada com sucesso" });
    }
    catch (erro) {
        next(erro);
    }
}
//# sourceMappingURL=auth.controller.js.map