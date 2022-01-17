const { response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async(req, res, next) => {

    const token = req.header('x-token');

    if (!token) return res.status(401).json({
        msg: "No hay token"
    });


    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATE_KEY);

        // Get user model
        const usuario = await Usuario.findById(uid);

        if (!usuario)
            return res.status(401).json({
                msg: 'Token no válido - usuario no existente'
            }); 

        // Check if the user is active (estado=true)
        if (!usuario.estado) 
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado ináctivo'
            });

        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token invalido'
        });
    }
}

module.exports = {
    validarJWT
}