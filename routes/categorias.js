const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria
} = require('../controllers/categorias');
const { validarJWT,
        validarCampos,
        esAdminRole 
} = require('../middlewares');
const { existeCategoria } = require('../helpers/db-validators');

const router = Router();

// Get all the categories - public
router.get('/', obtenerCategorias);

// Get one categorie - public
router.get('/:id',  [
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

// Get one categorie - private - any person with a valid token
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// update one categorie - private - any person with a valid token
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria);

// delete one categorie - private - Only admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);


module.exports = router;