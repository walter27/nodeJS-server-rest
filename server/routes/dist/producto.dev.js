"use strict";

var express = require('express');

var app = express();

var Producto = require('../models/producto');

var _require = require('../middlewares/autenticacion'),
    verficaToken = _require.verficaToken,
    verificaRol = _require.verificaRol; //===========================
//     Obtener Productos
//===========================


app.get('/productos', verficaToken, function (req, res) {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Producto.find({
    disponible: true
  }).skip(desde).limit(5).populate('usuario', 'nombre email').populate('categoria', 'nombre').exec(function (err, productos) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      productos: productos
    });
  });
}); //==============================
//     Obtener Producto por id
//==============================

app.get('/producto/:id', function (req, res) {
  var id = req.params.id;
  Producto.findById(id).populate('usuario', 'nombre email').populate('categoria', 'nombre').exec(function (err, productoBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El id no existe'
        }
      });
    }

    res.json({
      ok: true,
      productoBD: productoBD
    });
  });
}); //===========================
//     Crear nuevo producto
//===========================

app.post('/producto', verficaToken, function (req, res) {
  var body = req.body;
  var producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  });
  producto.save(function (err, productoBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      producto: productoBD
    });
  });
}); //===========================
//     Actualizar el produto
//===========================

app.put('/producto/:id', verficaToken, function (req, res) {
  var id = req.params.id;
  var body = req.body;
  var descProducto = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  };
  Producto.findByIdAndUpdate(id, descProducto, {
    "new": true,
    runValidators: true
  }, function (err, productoBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'el id no existe'
        }
      });
    }

    res.json({
      ok: true,
      Producto: productoBD
    });
  });
}); //================================
//     Eliminar producto por id
//================================

app["delete"]('/producto/:id', [verficaToken, verificaRol], function (req, res) {
  var id = req.params.id;
  var cambiaDisponible = {
    disponible: false,
    usuario: req.usuario._id
  };
  Producto.findByIdAndUpdate(id, cambiaDisponible, {
    "new": true
  }, function (err, productoBD) {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      producto: productoBD
    });
  });
}); //================================
//     Buscar producto
//================================

app.get('/producto/buscar/:termino', verficaToken, function (req, res) {
  var termino = req.params.termino; //mandar expresion regular (i)=>insensible a las mayusculas y minusculas

  var regex = new RegExp(termino, 'i');
  Producto.find({
    nombre: regex
  }).populate('categoria', 'nombre').exec(function (err, productos) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    res.json({
      ok: true,
      productos: productos
    });
  });
});
module.exports = app;