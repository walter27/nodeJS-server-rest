"use strict";

//puerto
process.env.PORT = process.env.PORT || 3000; //entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
var urlDB; //base  de datos
//if (process.env.NODE_ENV === 'dev') {
//   urlDB = 'mongodb://localhost:27017/cafe';
//} else {

urlDB = 'mongodb+srv://mongo:1234@cluster0-iyyjm.mongodb.net/test?retryWrites=true&w=majority'; //}

process.env.URLDB = urlDB;