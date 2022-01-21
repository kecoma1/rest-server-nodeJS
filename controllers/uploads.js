const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res) => {
    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'text');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
    
        res.json({
            nombre
        });
    } catch (error) {
        res.status(400).json({msg: error});
    }
}

const actualizarImagen = async(req, res) => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo)
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
        break;
        
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo)
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
        break;
    
        default:
            return res.status(500).json({msg: 'Hay que validar esto'});
    }

    // Removing previous images
    if (modelo.img) {
        // Delete img in the server
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen))
            fs.unlinkSync(pathImagen);
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();
    
    return res.json({modelo});
}

const mostrarImagen = async(req, res) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo)
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
        break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo)
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
        break;
    
        default:
            return res.status(500).json({msg: 'Hay que validar esto'});
    }

    // Removing previous images
    if (modelo.img) {
        // Delete img in the server
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen))
            return res.sendFile(pathImagen);
    }

    const noImgPath = path.join(__dirname, '../assets', 'no-image.jpg');
    return res.sendFile(noImgPath);
}

const actualizarImagenCloudinary = async(req, res) => {
    
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo)
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
        break;
        
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo)
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
        break;
    
        default:
            return res.status(500).json({msg: 'Hay que validar esto'});
    }

    // Removing previous images
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    modelo.save();

    return res.json({msg: 'Imágen subida correctamente', modelo});
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}