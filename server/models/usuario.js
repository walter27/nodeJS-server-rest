const monggose = require('mongoose');
const unique = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN:ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


let Schema = monggose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre ese nesesario']
    },

    email: {
        type: String,
        unique: true,
        require: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false

    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})


usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usuarioSchema.plugin(unique, {
    message: '{PATH} debe ser unico'
})

module.exports = monggose.model('Usuario', usuarioSchema);