const jwt = require("jsonwebtoken");

const USER = "admin";
const PASS = "1234";

const login = (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.json({
            message: alerta(),
            token: null
        });
    }

    if (usuario === USER && password === PASS) {
        const token = jwt.sign(
            { usuario },
            "CLAVE_SECRETA",
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login con privilegios, token generado",
            token
        });
    }

    return res.json({
        message: "Login sin privilegios, sin token",
        token: null
    });
};

module.exports = {
    login
};


