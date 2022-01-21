const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    }, 
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        // Foreign key
        type: Schema.Types.ObjectId,
        ref: 'Usuario',

        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        // Foreign key
        type: Schema.Types.ObjectId,
        ref: 'Categoria',

        required: true
    },
    descripcion: { type: String },
    disponible: { type: String, default: true },
    img: {type: String}
});

ProductoSchema.methods.toJSON = function() {
    const { __v, ...categoria } = this.toObject();
    return categoria;
}

module.exports = model('Producto', ProductoSchema)