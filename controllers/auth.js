const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');

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

const googleSignIn = async(req, res) => {

    const { id_token } = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // Create user
            const data = { 
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if (!usuario.estado) 
            return res.status(401).json({
                msg: 'No autorizado'
            });

        // Check the JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'De locos',
            token,
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
}

module.exports = {
    login,
    googleSignIn
};