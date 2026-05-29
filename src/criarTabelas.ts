import "dotenv/config";
import mysql from "mysql2/promise"; 

async function criarTabelas(): Promise<void> {
    // Criamos uma conexão inicial SEM especificar o banco de dados
    const conexaoInicial = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
    });

    try {
        // Cria o banco de dados se ele não existir
        await conexaoInicial.query("CREATE DATABASE IF NOT EXISTS dashboard_financeiro;");
        console.log("✅ Banco de dados 'dashboard_financeiro' garantido!");
        
        // Fechamos a conexão temporária
        await conexaoInicial.end();

        // Agora que o banco existe, criamos a conexão final (com o banco correto)
        // Aqui usamos as configurações que você já tem no seu db.js
        const { default: pool } = await import("./db.js");
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

        // Executa a criação das tabelas em ordem por causa das Foreign Keys
        await conexao.query(usuarios);
        console.log("✅ Tabela usuarios criada!");

        await conexao.query(categorias);
        console.log("✅ Tabela categorias criada!");
    
        await conexao.query(transacoes);
        console.log("✅ Tabela transacoes criada!");

        // Encerra o pool principal
        await pool.end();

    } catch (erro) {
        console.error("❌ Erro ao criar tabelas:", erro);
        try { await conexaoInicial.end(); } catch {}
    }
}
     
criarTabelas();