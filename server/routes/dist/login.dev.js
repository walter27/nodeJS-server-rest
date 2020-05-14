"use strict";

var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

app.post('/login', function (req, res) {
  var body = req.body;
  Usuario.findOne({
    email: body.email
  }, function (err, usuarioBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorretos'
        }
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorretos'
        }
      });
    }

    var token = jwt.sign({
      usuario: usuarioBD
    }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN
    });
    res.json({
      ok: true,
      usuario: usuarioBD,
      token: token
    });
  });
});
module.exports = app;