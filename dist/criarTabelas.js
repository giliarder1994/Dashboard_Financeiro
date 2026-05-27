import "dotenv/config";
import pool from "./db.js";
const conexao = pool.promise();
const usuarios = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;
const categorias = `
    CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        tipo ENUM('receita', 'despesa') NOT NULL,
        usuario_id INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
`;
const transacoes = `
    CREATE TABLE IF NOT EXISTS transacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        descricao VARCHAR(255) NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        tipo ENUM('receita', 'despesa') NOT NULL,
        data DATE NOT NULL,
        usuario_id INT NOT NULL,
        categoria_id INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
`;
async function criarTabelas() {
    try {
        await conexao.query(usuarios);
        console.log("✅ Tabela usuarios criada!");
        await conexao.query(categorias);
        console.log("✅ Tabela categorias criada!");
        await conexao.query(transacoes);
        console.log("✅ Tabela transacoes criada!");
    }
    catch (erro) {
        console.error("❌ Erro ao criar tabelas:", erro);
    }
    finally {
        // Encerra o pool para o processo Node sair limpo
        pool.end();
    }
}
criarTabelas();
//# sourceMappingURL=criarTabelas.js.map