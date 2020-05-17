"use strict";

var jwt = require('jsonwebtoken'); //==================================================
//          verificar token 
//==================================================


var verficaToken = function verficaToken(req, res, next) {
  var token = req.get('token');
  jwt.verify(token, process.env.SEED, function (err, decode) {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'token no valido'
        }
      });
    }

    req.usuario = decode.usuario;
    next();
  });
}; //==================================================
//          verificar rol
//==================================================


var verificaRol = function verificaRol(req, res, next) {
  var usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
}; //==================================================
//          verificar token  para imagen
//==================================================


var verficaTokenImg = function verficaTokenImg(req, res, next) {
  var token = req.query.token;
  jwt.verify(token, process.env.SEED, function (err, decode) {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'token no valido'
        }
      });
    }

    req.usuario = decode.usuario;
    next();
  });
};

module.exports = {
  verficaToken: verficaToken,
  verificaRol: verificaRol,
  verficaTokenImg: verficaTokenImg
};