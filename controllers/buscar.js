const { ObjectId } = require('mongoose').Types;

const { Usuario,
        Categoria,
        Producto,
        Role
} = require('../models');


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

const buscarRole = async(termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await modelo.findById(termino);
        return res.json({
            results: usuario ? [ usuario ] : [ ]
        });
    }

    const regex = new RegExp(termino, 'i');

    const item = await modelo.find({
        $and: [
            {nombre: regex},
            {rol: true}
        ]
    });

    return res.json({
        results: item
    });
}

const buscarGenerico = async(modelo, termino = '', res, ...populates) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await modelo.findById(termino);
        return res.json({
            results: usuario ? [ usuario ] : [ ]
        });
    }

    const regex = new RegExp(termino, 'i');

    const item = await modelo.find({
        $and: [
            {nombre: regex},
            {estado: true}
        ]
    }).populate(populates);

    return res.json({ 
        results: item
    });
}

const buscarUsuarios = async(termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: usuario ? [ usuario ] : [ ]
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $and: [
            {
                $or: [
                    {nombre: regex},
                    {correo: regex},
                    {rol: regex}
                ]
            },
            {estado: true}
        ]
    });

    return res.json({
        results: usuarios
    });
}

const buscar = (req, res) => {
    
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion))
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
            coleccion, termino
        });

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarGenerico(Categoria, termino, res, 'usuario');
        break;
        case 'productos':
            buscarGenerico(Producto, termino, res, 'categoria', 'usuario');
        break;
        case 'roles':
            buscarRole(termino, res);
        break;
        

        default:
            res.status(500).json({
                msg: 'Busqueda not found'
            })
    }
}

module.exports = {
    buscar
}
