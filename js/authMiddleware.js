const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    // Verificar si viene el header Authorization
    if (!authHeader) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1]; // formato: "Bearer token"

    try {
        const decoded = jwt.verify(token, "CLAVE_SECRETA");
        req.user = decoded; // guardamos los datos del token en la request
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado" });
    }
};
