"use strict";

var monggose = require('mongoose');

var unique = require('mongoose-unique-validator');

var rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
};
var Schema = monggose.Schema;
var usuarioSchema = new Schema({
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
    "default": 'USER_ROLE',
    "enum": rolesValidos
  },
  estado: {
    type: Boolean,
    "default": true
  },
  google: {
    type: Boolean,
    "default": false
  }
});

usuarioSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

usuarioSchema.plugin(unique, {
  message: '{PATH} debe ser unico'
});
module.exports = monggose.model('Usuario', usuarioSchema);