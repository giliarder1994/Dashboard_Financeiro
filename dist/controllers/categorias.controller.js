import pool from "../db.js";
// GET /categorias
export async function listar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const [rows] = await pool.promise().query("SELECT * FROM categorias WHERE usuario_id = ?", [usuario_id]);
        res.status(200).json(rows);
    }
    catch (erro) {
        next(erro);
    }
}
// POST /categorias
export async function criar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const { nome, tipo } = req.body;
        if (!nome || !tipo) {
            res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
            return;
        }
        if (tipo !== "receita" && tipo !== "despesa") {
            res.status(400).json({ erro: "Tipo deve ser receita ou despesa" });
            return;
        }
        const [resultado] = await pool.promise().query("INSERT INTO categorias (nome, tipo, usuario_id) VALUES (?, ?, ?)", [nome, tipo, usuario_id]);
        res.status(201).json({ id: resultado.insertId, nome, tipo });
    }
    catch (erro) {
        next(erro);
    }
}
// PUT /categorias/:id
export async function atualizar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);
        const { nome, tipo } = req.body;
        const [resultado] = await pool.promise().query("UPDATE categorias SET nome = ?, tipo = ? WHERE id = ? AND usuario_id = ?", [nome, tipo, id, usuario_id]);
        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Categoria não encontrada" });
            return;
        }
        res.status(200).json({ id, nome, tipo });
    }
    catch (erro) {
        next(erro);
    }
}
// DELETE /categorias/:id
export async function deletar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);
        const [resultado] = await pool.promise().query("DELETE FROM categorias WHERE id = ? AND usuario_id = ?", [id, usuario_id]);
        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Categoria não encontrada" });
            return;
        }
        res.status(204).send();
    }
    catch (erro) {
        next(erro);
    }
}
//# sourceMappingURL=categorias.controller.js.map