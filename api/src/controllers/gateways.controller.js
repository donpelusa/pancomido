// api/src/controllers/gateways.controller.js

const paymentService = require('../services/paymentService');

const createPayment = async (req, res, next) => {
    try {
        const paymentData = req.body;
        // Se invoca la función del paymentService para procesar el pago.
        const result = await paymentService.createPayment(paymentData);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createPayment,
};
