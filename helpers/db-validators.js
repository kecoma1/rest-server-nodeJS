const { isValidObjectId } = require('mongoose');

const { 
    Categoria, 
    Role, 
    Usuario,
    Producto 
} = require('../models');


const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol)
        throw new Error(`El rol ${rol} no existe`);

} 

const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail)
        throw new Error(`El email ${correo} ya está registrado`);
}

const existeUsuarioPorId = async(id = '') => {
    if (!isValidObjectId(id))
        throw new Error(`ID inválido ${ id }`);

    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario)
        throw new Error(`ID inexistente ${ id }. No existe`);
}

const existeCategoria = async(id = '') => {
    if (!isValidObjectId(id))
        throw new Error(`ID invalido ${ id }`);
    
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria)
        throw new Error(`ID inexistente ${ id }. No existe`);
}

const existeProducto = async(id = '') => {
    if (!isValidObjectId(id))
        throw new Error(`ID invalido ${ id }`);
    
    const existeProducto = await Producto.findById(id);
    if (!existeProducto)
        throw new Error(`ID inexistente ${ id }. No existe`);
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}