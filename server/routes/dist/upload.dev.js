"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var fileUpload = require('express-fileupload');

var app = express();

var Usuario = require('../models/usuario');

var Producto = require('../models/producto');

var fs = require('fs');

var path = require('path'); // default options


app.use(fileUpload());
app.put('/upload/:tipo/:id', function (req, res) {
  var tipo = req.params.tipo;
  var id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      oh: false,
      err: {
        message: 'No se ha selecionado ningun archivo'
      }
    });
  } //VALIDAR TIPO


  var tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'los tipos permitidos son ' + tiposValidos.join(', ')
      }
    });
  }

  var archivo = req.files.archivo;
  var nombreArchivo = archivo.name.split('.');
  var extension = nombreArchivo[nombreArchivo.length - 1]; //EXTENSIONES PERMITIDAS

  var extensionesValidas = ['png', 'jpg', 'gif', 'jpg'];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'las extensiones permitidas son ' + extensionesValidas.join(', '),
        ext: extension
      }
    });
  } //CAMBIAR NOMBRE DEL ARCHIVO- DEBE SER UNICO Y AGREGARLE ALGO PARA PREVENIR EL CACHE DE NAVEGADOR


  var nombreArchivo2 = "".concat(id, "-").concat(new Date().getMilliseconds(), ".").concat(extension);
  archivo.mv("../uploads/".concat(tipo, "/").concat(nombreArchivo2), function (err) {
    if (err) return res.status(500).json(_defineProperty({
      err: false
    }, "err", err)); //IMAGEN CARGADO EN EL FILE SYSTEM

    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo2);
    } else {
      imagenProducto(id, res, nombreArchivo2);
    }
  });
});

function imagenUsuario(id, res, nombreArchivo2) {
  Usuario.findById(id, function (err, usuarioBD) {
    if (err) {
      borrarArchivo(nombreArchivo2, 'usuarios');
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!usuarioBD) {
      borrarArchivo(nombreArchivo2, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no existe'
        }
      });
    }

    borrarArchivo(usuarioBD.img, 'usuarios');
    usuarioBD.img = nombreArchivo2;
    usuarioBD.save(function (err, usuarioGuardado) {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo2
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo2) {
  Producto.findById(id, function (err, productoBD) {
    if (err) {
      borrarArchivo(nombreArchivo2, 'productos');
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!productoBD) {
      borrarArchivo(nombreArchivo2, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no existe'
        }
      });
    }

    borrarArchivo(productoBD.img, 'productos');
    productoBD.img = nombreArchivo2;
    productoBD.save(function (err, productoGuardado) {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo2
      });
    });
  });
}

function borrarArchivo(nombreImagne, tipo) {
  var pathImagen = path.resolve(__dirname, "../../uploads/".concat(tipo, "/").concat(nombreImagne));

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;