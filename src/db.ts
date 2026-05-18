import "dotenv/config";
import mysql from "mysql2";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
});

pool.getConnection((erro, conexao) => {
    if(erro) {
        console.error("Erro ao conectar ao banco de dados:", erro.message);
        return;
    }
    console.log("Conectado ao MySQL com sucesso");
    conexao.release();
})

export default pool;