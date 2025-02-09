// api/src/middlewares/isAdmin.js
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "Acceso denegado: rol no especificado." });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado: no eres administrador." });
    }
    next();
};

module.exports = isAdmin;
