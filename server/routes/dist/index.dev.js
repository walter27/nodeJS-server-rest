"use strict";

var express = require('express');

var app = express();
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
module.exports = app;