// backend/src/middlewares/isAdmin.js
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "Acceso denegado: rol no especificado." });
    }
    // Permite acceso si el rol es "admin" o "developer"
    if (req.user.role !== "admin" && req.user.role !== "developer") {
        return res.status(403).json({ error: "Acceso denegado: no tienes permisos." });
    }
    next();
};

module.exports = isAdmin;
