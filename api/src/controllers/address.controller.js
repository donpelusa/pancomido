// api/src/controllers/address.controller.js

const Address = require('../models/Address');

/*
    Controladores para las direcciones de los usuarios.
*/

// Crear una nueva dirección para el usuario autenticado.
const createAddress = async (req, res, next) => {
    try {
        // Verificar que el usuario esté autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'No autenticado. Token inválido o no proporcionado.' });
        }
        const id_user = req.user.id;    // Obtener el id del usuario autenticado
        const addressData = { ...req.body, id_user }; // Agregar el id del usuario a los datos de la dirección

        // Si el usuario está enviando main: true en la solicitud,
        // o si es la primera dirección del usuario (sin dirección principal existente)
        const existingMain = await Address.getMainAddress(id_user);
        if (addressData.main === true) {
            // Desactivar la marca principal en las otras direcciones
            await Address.unsetMainForOtherAddresses(id_user);
        } else if (!existingMain) {
            // Si no existe ninguna dirección principal, forzamos que la nueva sea principal
            addressData.main = true;
        }

        const newAddress = await Address.createAddress(addressData);    // Crear la nueva dirección
        res.status(201).json(newAddress);   // Responder con la dirección creada
    } catch (err) {
        next(err);
    }
};

// Obtener todas las direcciones del usuario autenticado.
const getAddresses = async (req, res, next) => {
    try {
        const id_user = req.user.id;    // Obtener el id del usuario autenticado
        const addresses = await Address.getAddresses(id_user);  // Obtener las direcciones del usuario
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};

// Actualizar una dirección del usuario autenticado.
const updateAddress = async (req, res, next) => {
    try {
        const id_user = req.user.id;
        const { id } = req.params;  // Obtener el id de la dirección a actualizar
        // Si en el body se envía main = true, antes de actualizar desactivar en las demás
        if (req.body.main === true) {
            await Address.unsetMainForOtherAddresses(id_user, id);  // Desactivar la marca principal en las otras direcciones
        }
        const updated = await Address.updateAddress(id, id_user, req.body); // Actualizar la dirección
        if (!updated) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// Eliminar una dirección del usuario autenticado.
const deleteAddress = async (req, res, next) => {
    try {
        const id_user = req.user.id;
        const { id } = req.params;

        // Obtener la dirección a eliminar
        const addressToDelete = await Address.getAddressById(id, id_user);
        if (!addressToDelete) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }

        // Si la dirección a eliminar es la principal (main = true)
        if (addressToDelete.main === true) {
            const addresses = await Address.getAddresses(id_user);  // Obtener todas las direcciones del usuario
            const otherAddresses = addresses.filter(addr => addr.id != id); // Filtrar y obtener las direcciones que no sean la que se eliminará

            if (otherAddresses.length === 0) {
                return res.status(400).json({ error: 'No se puede eliminar la única dirección registrada. Agrega otra dirección y luego intente nuevamente.' });
            }

            // Escoger la primera dirección de las restantes para que sea la nueva principal.
            // Aquí se puede escoger, por ejemplo, la de menor id.
            const newMainAddress = otherAddresses.sort((a, b) => a.id - b.id)[0];

            // Actualizar esa dirección para que sea principal.
            // Se actualizan solo los campos necesarios, manteniendo los valores actuales.
            await Address.updateAddress(newMainAddress.id, id_user, {
                id_city: newMainAddress.id_city,
                address: newMainAddress.address,
                postal_code: newMainAddress.postal_code,
                main: true
            });
        }

        // Proceder a eliminar la dirección
        const deleted = await Address.deleteAddress(id, id_user);
        if (!deleted) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }
        res.json({ message: "Dirección eliminada", deleted });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
};
