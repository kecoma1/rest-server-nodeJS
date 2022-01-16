

const usuariosGet = (req, res) => {

    const { q, nombre = 'no name' } = req.query;

    res.json({
        msg: 'get API',
        q,
        nombre
    });
}

const usuariosPut = (req, res) => {

    const id = req.params.id;

    res.json({
        msg: "put API key",
        id
    });
}

const usuariosPost = (req, res) => {

    const { nombre, edad } = req.body;
    console.log(body);

    res.status(201).json({
        msg: "post API key",
        nombre,
        edad
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: "delete API key"
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: "patch API key"
    });
}

module.exports = {
    usuariosGet, 
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}