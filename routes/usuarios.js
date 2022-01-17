
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarJWT,
    validarCampos,
    esAdminRole,
    tieneRole
 } = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { 
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 caracteres').isLength({min: 6}),
    check('correo', 'El correo es invalido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;