// api/src/controllers/favorites.controller.js

const Favorites = require('../models/Favorites');

// 
const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Se requiere productId' });
        }
        const favorite = await Favorites.addFavorite(userId, productId);
        // Si favorite es undefined, se asume que ya existía el registro.
        res.status(201).json(favorite || { message: 'Producto ya está en favoritos' });
    } catch (err) {
        next(err);
    }
};

const removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Se requiere productId' });
        }
        const removed = await Favorites.removeFavorite(userId, productId);
        if (!removed) {
            return res.status(404).json({ error: 'Favorito no encontrado' });
        }
        res.json({ message: 'Favorito eliminado', removed });
    } catch (err) {
        next(err);
    }
};

const listFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorites.getFavorites(userId);
        res.json(favorites);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    listFavorites,
};

