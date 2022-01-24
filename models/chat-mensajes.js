class Mensaje {
    constructor(uid, nombre, mensaje, privado) {
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
        this.privado = false;
    }
}

class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuariosArr = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0, 10);
        return this.mensajes;
    }

    get usuarios() {
        return Object.values(this.usuariosArr);
    }

    enviarMensaje(uid, nombre, mensaje, privado = false) {
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje, privado)
        );
    }

    agregarUsuario(usuario) {
        this.usuariosArr[usuario.id] = usuario;
    }

    desconectarUsuario(id) {
        delete this.usuariosArr[id];
    }
}

module.exports = ChatMensajes