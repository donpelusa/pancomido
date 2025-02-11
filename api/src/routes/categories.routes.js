// src/routes/categories.routes.js
const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categories.controller');
const { validateToken } = require('../middlewares/validateToken');

router.get('/', validateToken, getCategories);

module.exports = router;
