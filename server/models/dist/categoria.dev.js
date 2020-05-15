"use strict";

var monggose = require('mongoose');

var unique = require('mongoose-unique-validator');

var Schema = monggose.Schema;
var categoriaSchema = new Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, 'La descripción es obligatoria']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});
categoriaSchema.plugin(unique, {
  message: '{PATH} debe ser unico'
});
module.exports = monggose.model('Categoria', categoriaSchema);