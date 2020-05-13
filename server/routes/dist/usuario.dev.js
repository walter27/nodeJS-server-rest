"use strict";

var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

var bcrypt = require('bcrypt');

var _ = require('underscore');

app.get('/usuario', function (req, res) {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  var limite = req.query.limite || 5;
  limite = Number(limite);
  Usuario.find({
    estado: true
  }, 'nombre email role estado google img').skip(desde).limit(limite).exec(function (err, usuarios) {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: error
      });
    }

    Usuario.count({
      estado: true
    }, function (err, conteo) {
      res.json({
        ok: true,
        usuarios: usuarios,
        cantidad: conteo
      });
    });
  });
});
app.post('/usuario', function (req, res) {
  var body = req.body;
  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });
  usuario.save(function (error, usuarioDB) {
    if (error) {
      return res.status(400).json({
        ok: false,
        error: error
      });
    } //usuarioDB.password = null;


    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});
app.put('/usuario/:id', function (req, res) {
  var id = req.params.id;

  var body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, {
    "new": true,
    runValidators: true
  }, function (err, usuarioDB) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });
});
app["delete"]('/usuario/:id', function (req, res) {
  var id = req.params.id; //Usuario.findByIdAndRemove(id, (err, usuarioBD) => {

  var cambiaEstado = {
    estado: false
  };
  Usuario.findByIdAndUpdate(id, cambiaEstado, {
    "new": true
  }, function (err, usuarioBD) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBD
    });
  });
});
module.exports = app;