const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async(socket, io) => {
    
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']); 

    if (!usuario) return socket.disconnect();

    // Adding a connected user
    chatMensajes.agregarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);
    
    // Conecting the socket to an special room
    socket.join(usuario.id);

    // Deleting when someone disconnects
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        // Private message
        if (uid)
            return socket.to(uid).emit('mensaje-privado', { 
                de: usuario.nombre, 
                mensaje
            });

        chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        io.emit('recibir-mensajes', chatMensajes.ultimos10);
    });
}

module.exports = {
    socketController
}