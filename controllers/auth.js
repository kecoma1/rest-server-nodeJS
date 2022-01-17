const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res) => {

    const { correo, password } = req.body;

    try {

        // Check if the email exists
        const usuario = await Usuario.findOne({correo});
        if (!usuario)
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto'
            });

        // Check if the user is active (state)
        if (!usuario.estado)
            return res.status(400).json({
                msg: 'Usuario inactivo'
            });

        // Check the password
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) 
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto'
            });

        // Check the JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Login ok',
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
}

module.exports = {
    login
};