const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:           '/api/auth',
            buscar:         '/api/buscar',
            categorias:     '/api/categorias',
            usuarios:       '/api/usuarios',
            productos:      '/api/productos'
        }

        // Connect db
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Configuring the routes
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del middleware
        this.app.use( express.json() );

        // Accediendo al directorio public
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('App running in', this.port);
        });
    }

}


module.exports = Server;