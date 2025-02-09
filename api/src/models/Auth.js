// api/src/models/Auth.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    // Convertir role_id a un string representativo, por ejemplo:
    const role = user.role_id === 2 || user.role_id === 3 ? "admin" : "customer";
    const payload = { id: user.id, email: user.mail, role };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};
