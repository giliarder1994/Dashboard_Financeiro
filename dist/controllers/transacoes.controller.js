import pool from "../db.js";
// GET /transacoes
export async function listar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const tipo = req.query.tipo;
        const pagina = Number(req.query.pagina ?? 1);
        const limite = Number(req.query.limite ?? 10);
        const offset = (pagina - 1) * limite;
        let sql = `
      SELECT t.id, t.descricao, t.valor, t.tipo, t.data,
             c.nome AS categoria
      FROM transacoes t
      JOIN categorias c ON t.categoria_id = c.id
      WHERE t.usuario_id = ?
    `;
        const params = [usuario_id];
        if (tipo) {
            sql += " AND t.tipo = ?";
            params.push(tipo);
        }
        sql += " ORDER BY t.data DESC LIMIT ? OFFSET ?";
        params.push(limite, offset);
        const [rows] = await pool.promise().query(sql, params);
        res.status(200).json(rows);
    }
    catch (erro) {
        next(erro);
    }
}
// POST /transacoes
export async function criar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const { descricao, valor, tipo, data, categoria_id } = req.body;
        if (!descricao || !valor || !tipo || !data || !categoria_id) {
            res.status(400).json({ erro: "Todos os campos são obrigatórios" });
            return;
        }
        if (tipo !== "receita" && tipo !== "despesa") {
            res.status(400).json({ erro: "Tipo deve ser receita ou despesa" });
            return;
        }
        const [resultado] = await pool.promise().query("INSERT INTO transacoes (descricao, valor, tipo, data, usuario_id, categoria_id) VALUES (?, ?, ?, ?, ?, ?)", [descricao, valor, tipo, data, usuario_id, categoria_id]);
        res.status(201).json({ id: resultado.insertId, descricao, valor, tipo, data, categoria_id });
    }
    catch (erro) {
        next(erro);
    }
}
// PUT /transacoes/:id
export async function atualizar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);
        const { descricao, valor, tipo, data, categoria_id } = req.body;
        const [resultado] = await pool.promise().query("UPDATE transacoes SET descricao = ?, valor = ?, tipo = ?, data = ?, categoria_id = ? WHERE id = ? AND usuario_id = ?", [descricao, valor, tipo, data, categoria_id, id, usuario_id]);
        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Transação não encontrada" });
            return;
        }
        res.status(200).json({ id, descricao, valor, tipo, data, categoria_id });
    }
    catch (erro) {
        next(erro);
    }
}
// DELETE /transacoes/:id
export async function deletar(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const id = Number(req.params.id);
        const [resultado] = await pool.promise().query("DELETE FROM transacoes WHERE id = ? AND usuario_id = ?", [id, usuario_id]);
        if (resultado.affectedRows === 0) {
            res.status(404).json({ erro: "Transação não encontrada" });
            return;
        }
        res.status(204).send();
    }
    catch (erro) {
        next(erro);
    }
}
// GET /transacoes/resumo
export async function resumo(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const [rows] = await pool.promise().query(`SELECT
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0   END) AS total_receitas,
         SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0   END) AS total_despesas,
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) AS saldo
       FROM transacoes
       WHERE usuario_id = ?`, [usuario_id]);
        res.status(200).json(rows[0]);
    }
    catch (erro) {
        next(erro);
    }
}
// GET /transacoes/mensal
export async function mensal(req, res, next) {
    try {
        const usuario_id = req.usuario.id;
        const [rows] = await pool.promise().query(`SELECT
         DATE_FORMAT(data, '%Y-%m') AS mes,
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS receitas,
         SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS despesas
       FROM transacoes
       WHERE usuario_id = ?
       GROUP BY DATE_FORMAT(data, '%Y-%m')
       ORDER BY mes ASC
       LIMIT 6`, [usuario_id]);
        res.status(200).json(rows);
    }
    catch (erro) {
        next(erro);
    }
}
//# sourceMappingURL=transacoes.controller.js.map