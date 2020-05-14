"use strict";

var express = require('express');

var app = express();
app.use(require('./usuario'));
app.use(require('./login'));
module.exports = app;