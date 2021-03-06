"use strict";

//=====================================================
//                     puerto
//======================================================
process.env.PORT = process.env.PORT || 3000; //=====================================================
//                     entorno
//======================================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //=====================================================
//                     verificacion del token
//======================================================
//60 segundos
//60 minutos
//24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = '48h'; //=====================================================
//                     sedd de autenticacion
//======================================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; //=====================================================
//                     Base de Datos
//======================================================

var urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB; //=====================================================
//                     google client id
//======================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '538886611473-h6hu0n0klo8b60m403u2aodbo6bekms5.apps.googleusercontent.com';