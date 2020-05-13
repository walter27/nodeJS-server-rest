"use strict";

require('./config/config');

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose'); // parse application/x-www-form-urlencoded


app.use(bodyParser.urlencoded({
  extended: false
})); // parse application/json

app.use(bodyParser.json());
app.use(require('./routes/usuario')); //dstabase mongoose

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err, res) {
  if (err) throw err;
  console.log('Base de datos conectada');
});
app.listen(process.env.PORT, function () {
  console.log('Servidor desplegado');
});