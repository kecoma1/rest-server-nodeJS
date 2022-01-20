const { Categoria } = require('../models');

const obtenerCategoria = async(req, res) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id)
                                     .populate('usuario', 'nombre');

    res.json(categoria);
}

// obtenerCategorias - total - populate {}
const obtenerCategorias = async(req, res) => {

    const { limite = '5', desde = '0' } = req.query;
    const query = {estado: true}

    if (isNaN(limite) || isNaN(desde)) 
    res.status(400).json({
        msg: "<limite> y <desde> deben ser números"
    });


    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

const crearCategoria = async(req, res) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await  Categoria.findOne({nombre});

    if (categoriaDB)
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();

    res.status(201).json(categoria);
}

const actualizarCategoria = async(req, res) => {
    const { id } = req.params;
    const { _id, __v, estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data);

    return res.json(categoria);
}

const borrarCategoria = async(req, res) => {
    const { id } = req.params;

    categoria = await Categoria.findByIdAndUpdate(id, {estado: false});
    usuario = req.usuario;

    return res.json({
        categoria,
        usuario
    });
}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}
