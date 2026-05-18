import type {Request} from "express";

export interface JwtPayload {
    id: number;
    nome: string;
    iat?: number;
    exp?: number;
}

export interface RequestAutenticado extends Request {
    usuario: JwtPayload;
}

export type TipoTransacao = "receita" | "despesa";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    criado_em: Date;
}

export interface Categoria {
    id: number;
    nome: string;
    tipo: TipoTransacao;
    usuario_id: number;
}

export interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    data: string;
    usuario_id: number;
    categoria_id: number;
}