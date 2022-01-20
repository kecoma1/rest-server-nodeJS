const { Producto, Categoria } = require('../models');

const obtenerProducto = async(req, res) => {

    const { id } = req.params;

    const categoria = await Producto.findById(id)
                                     .populate('usuario', 'nombre')
                                     .populate('categoria', 'nombre');

    res.json(categoria);
}

// obtenerProductos - total - populate {}
const obtenerProductos = async(req, res) => {

    const { limite = '5', desde = '0' } = req.query;
    const query = {estado: true}

    if (isNaN(limite) || isNaN(desde)) 
    res.status(400).json({
        msg: "<limite> y <desde> deben ser números"
    });


    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

const crearProducto = async(req, res) => {

    const nombre = req.body.nombre.toUpperCase();
    const nombreCategoria = req.body.categoria.toUpperCase();

    const { precio, disponible } = req.body;

    const productoDB = await Producto.findOne({nombre});

    if (productoDB)
        return res.status(400).json({
            msg: `La producto ${productoDB.nombre}, ya existe`
        });

    const categoria = await Categoria.findOne({nombreCategoria})

    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria: categoria._id,
        precio,
        disponible
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async(req, res) => {
    const { id } = req.params;
    const { _id, __v, estado, usuario, ...data } = req.body;

    const categoria = await Producto.findByIdAndUpdate(id, data);

    return res.json(categoria);
}

const borrarProducto = async(req, res) => {
    const { id } = req.params;

    producto = await Producto.findByIdAndUpdate(id, {estado: false});
    usuario = req.usuario;

    return res.json({
        producto,
        usuario
    });
}

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}
