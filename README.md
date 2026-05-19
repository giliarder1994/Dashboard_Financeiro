# 💰 Dashboard Financeiro - API REST

API REST para gerenciamento financeiro pessoal, desenvolvida com **Node.js**, **Express**, **TypeScript** e **MySQL**.
O projeto permite controle de receitas, despesas, categorias e autenticação de usuários utilizando JWT, seguindo uma arquitetura organizada e fortemente tipada.

---

# 🚀 Tecnologias

* **Node.js** — Ambiente de execução JavaScript
* **TypeScript** — Superset tipado do JavaScript
* **Express** — Framework web para APIs REST
* **MySQL** — Banco de dados relacional
* **mysql2** — Driver MySQL para Node.js
* **JWT (JSON Web Token)** — Autenticação segura
* **bcrypt** — Criptografia de senhas
* **dotenv** — Variáveis de ambiente
* **cors** — Liberação de acesso entre aplicações
* **tsx** — Execução TypeScript em desenvolvimento sem compilação manual

---

# 📁 Estrutura do Projeto

```bash id="ts001"
src/
 ├── controllers/          # Regras das requisições HTTP
 │
 ├── middlewares/          # Autenticação e tratamento de erros
 │
 ├── routes/               # Endpoints da aplicação
 │
 ├── types/                # Tipagens globais da aplicação
 │
 ├── app.ts                # Inicialização do Express
 ├── db.ts                 # Configuração do MySQL
 └── criarTabelas.ts       # Script de criação das tabelas

package.json
tsconfig.json
```

---

# ⚙️ Funcionalidades

## 🔐 Autenticação

* Cadastro de usuários
* Login com JWT
* Atualização de perfil
* Alteração de senha
* Rotas protegidas

---

## 📂 Categorias

* Criar categorias
* Listar categorias
* Atualizar categorias
* Remover categorias

Tipos disponíveis:

* Receita
* Despesa

---

## 💸 Transações Financeiras

* Cadastro de receitas e despesas
* Atualização de transações
* Exclusão de transações
* Paginação
* Filtro por tipo

---

## 📊 Relatórios Financeiros

### Resumo Financeiro

* Total de receitas
* Total de despesas
* Saldo consolidado

### Relatório Mensal

* Agrupamento mensal
* Histórico dos últimos meses
* Soma de receitas e despesas

---

# 🧠 Recursos Técnicos Implementados

## ✅ Segurança

* JWT para autenticação
* Senhas criptografadas com bcrypt
* Middleware de proteção de rotas
* Validação de payloads

---

# 🗄️ Estrutura do Banco de Dados

O sistema possui 3 tabelas principais:

## 👤 usuarios

Dados de autenticação dos usuários.

## 📂 categorias

Categorias financeiras vinculadas aos usuários.

## 💸 transacoes

Registro das movimentações financeiras.

---

# ⚙️ Como rodar localmente

## 1. Clone o repositório

```bash id="ts004"
git clone https://github.com/seu-usuario/dashboard-financeiro-typescript.git

cd dashboard-financeiro-typescript
```

---

## 2. Instale as dependências

```bash id="ts005"
npm install
```

---

## 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env id="ts006"
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=dashboard_financeiro

DB_PORT=3306

JWT_SECRET=sua_chave_secreta
```

---

## 4. Crie as tabelas do banco

```bash id="ts007"
npm run criar-tabelas
```

---

## 5. Rodar em desenvolvimento

```bash id="ts008"
npm run dev
```

---

## 6. Gerar build TypeScript

```bash id="ts009"
npm run build
```

Os arquivos compilados serão gerados em:

```bash id="ts010"
dist/
```

---

## 7. Executar versão compilada

```bash id="ts011"
npm start
```

Servidor disponível em:

👉 [http://localhost:3000](http://localhost:3000)

---

# 📋 Principais Rotas

## 🔐 Autenticação

| Método | Rota          | Descrição                |
| ------ | ------------- | ------------------------ |
| POST   | /cadastrar    | Cadastro de usuário      |
| POST   | /login        | Login e geração de token |
| GET    | /perfil       | Buscar perfil            |
| PUT    | /perfil       | Atualizar nome           |
| PUT    | /perfil/senha | Atualizar senha          |

---

## 📂 Categorias

| Método | Rota            | Descrição           |
| ------ | --------------- | ------------------- |
| GET    | /categorias     | Listar categorias   |
| POST   | /categorias     | Criar categoria     |
| PUT    | /categorias/:id | Atualizar categoria |
| DELETE | /categorias/:id | Remover categoria   |

---

## 💸 Transações

| Método | Rota               | Descrição           |
| ------ | ------------------ | ------------------- |
| GET    | /transacoes        | Listar transações   |
| GET    | /transacoes/resumo | Resumo financeiro   |
| GET    | /transacoes/mensal | Relatório mensal    |
| POST   | /transacoes        | Criar transação     |
| PUT    | /transacoes/:id    | Atualizar transação |
| DELETE | /transacoes/:id    | Remover transação   |

---

# 🧱 Arquitetura do Projeto

O sistema foi organizado em camadas para facilitar manutenção e escalabilidade:

* **Controllers** → lógica das requisições
* **Middlewares** → autenticação e tratamento de erros
* **Routes** → definição dos endpoints
* **Types** → centralização das tipagens
* **Database Layer** → conexão com MySQL


---

# 👨‍💻 Autor

Desenvolvido por **Giliarde Rodrigues**
