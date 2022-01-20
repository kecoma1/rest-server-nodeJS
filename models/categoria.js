const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    }
});

CategoriaSchema.methods.toJSON = function() {
    const { __v, ...categoria } = this.toObject();
    return categoria;
}

module.exports = model('Categoria', CategoriaSchema)