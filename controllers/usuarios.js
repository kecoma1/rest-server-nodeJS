const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req, res) => {

    const { limite = '5', desde = '0' } = req.query;
    const query = {estado: true}

    if (isNaN(limite) && isNaN(desde)) 
        res.status(400).json({
            msg: "<limite> y <desde> deben ser números"
        });

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: Validar con la base de datos
    // Actualización de la contrasena
    if ( password ) { 
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPost = async(req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Cypher the password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Save in the db
    await usuario.save();

    res.status(201).json(usuario);
}

const usuariosDelete = async(req, res) => {
    
    const { id } = req.params;
    const uid = req.uid;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
    });
}

const usuariosPatch = (req, res) => {

    const { id } = req.params;

    res.json({
        msg: "patch API key",
        id
    });
}

module.exports = {
    usuariosGet, 
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}