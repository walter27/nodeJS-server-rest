const monggose = require('mongoose');
const unique = require('mongoose-unique-validator');


let Schema = monggose.Schema;

let categoriaSchema = new Schema({

    nombre: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }
})


categoriaSchema.plugin(unique, {
    message: '{PATH} debe ser unico'
})

module.exports = monggose.model('Categoria', categoriaSchema);