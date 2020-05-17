"use strict";

var express = require('express');

var app = express();

var fs = require('fs');

var path = require('path');

var _require = require('../middlewares/autenticacion'),
    verficaTokenImg = _require.verficaTokenImg;

app.get('/imagen/:tipo/:img', verficaTokenImg, function (req, res) {
  var tipo = req.params.tipo;
  var img = req.params.img;
  var pathImagen = path.resolve(__dirname, "../../uploads/".concat(tipo, "/").concat(img));

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    var noImagnePath = path.resolve(__dirname, '../assets/no-image.jpg');
    res.sendFile(noImagnePath);
  }
});
module.exports = app;