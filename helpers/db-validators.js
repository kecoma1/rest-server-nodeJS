const { isValidObjectId } = require('mongoose');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}