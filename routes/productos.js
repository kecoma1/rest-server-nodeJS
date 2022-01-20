const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto
} = require('../controllers/productos');
const { validarJWT,
        validarCampos,
        esAdminRole 
} = require('../middlewares');
const { existeProducto } = require('../helpers/db-validators');

const router = Router();

// Get all the categories - public
router.get('/', obtenerProductos);

// Get one categorie - public
router.get('/:id',  [
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto);

// Get one categorie - private - any person with a valid token
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto);

// update one categorie - private - any person with a valid token
router.put('/:id', [
    validarJWT,
    //check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], actualizarProducto);

// delete one categorie - private - Only admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto);


module.exports = router;