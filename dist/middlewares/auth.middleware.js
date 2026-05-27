import jwt from "jsonwebtoken";
export function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ erro: "Token não fornecido" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "string") {
            res.status(401).json({ erro: "Token inválido" });
            return;
        }
        req.usuario = decoded;
        next();
    }
    catch {
        res.status(401).json({ erro: "Token inválido" });
    }
}
//# sourceMappingURL=auth.middleware.js.map