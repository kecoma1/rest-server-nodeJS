const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io     = require('socket.io')(this.server);

        this.paths = {
            auth:           '/api/auth',
            buscar:         '/api/buscar',
            categorias:     '/api/categorias',
            productos:      '/api/productos',
            usuarios:       '/api/usuarios',
            uploads:        '/api/uploads'
        }

        // Connect db
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Configuring the routes
        this.routes();

        // Sockets
        this.sockets();
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
        this.app.use( express.static('public') );

        // Fileupload
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }) );
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', socket => socketController(socket, this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('App running in', this.port);
        });
    }

}


module.exports = Server;