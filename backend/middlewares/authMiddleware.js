const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
    const token = req.headers["access-token"];

    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, "CLAVE_SECRETA");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};
