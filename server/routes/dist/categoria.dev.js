"use strict";

var express = require('express');

var app = express();

var Categoria = require('../models/categoria');

var _require = require('../middlewares/autenticacion'),
    verficaToken = _require.verficaToken,
    verificaRol = _require.verificaRol;

app.get('/categorias', verficaToken, function (req, res) {
  Categoria.find({}).sort('nombre').populate('usuario', 'nombre email').exec(function (err, categorias) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      categorias: categorias
    });
  });
});
app.get('/categoria/:id', function (req, res) {
  var id = req.params.id;
  Categoria.findById(id, function (err, categoriaBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      });
    }

    res.json({
      ok: true,
      categoriaBD: categoriaBD
    });
  });
});
app.post('/categoria', verficaToken, function (req, res) {
  var body = req.body;
  var categoria = new Categoria({
    nombre: body.nombre,
    usuario: req.usuario._id
  });
  categoria.save(function (err, categoriaBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD
    });
  });
});
app.put('/categoria/:id', verficaToken, function (req, res) {
  var id = req.params.id;
  var body = req.body;
  var descCategoria = {
    nombre: body.nombre
  };
  Categoria.findByIdAndUpdate(id, descCategoria, {
    "new": true,
    runValidators: true
  }, function (err, categoriaBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD
    });
  });
});
app["delete"]('/categoria/:id', [verficaToken, verificaRol], function (req, res) {
  var id = req.params.id;
  Categoria.findByIdAndRemove(id, function (err, categoriaBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'el id no existe'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD,
      message: {
        message: 'Categoria eliminada'
      }
    });
  });
});
module.exports = app;