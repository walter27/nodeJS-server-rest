"use strict";

var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var _require = require('google-auth-library'),
    OAuth2Client = _require.OAuth2Client;

var client = new OAuth2Client(process.env.CLIENT_ID);
app.post('/login', function (req, res) {
  var body = req.body;
  Usuario.findOne({
    email: body.email
  }, function (err, usuarioBD) {
    if (err) {
      return res.status(500).json({
        ok: false,
        err: err
      });
    }

    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: '(Usuario) o contraseña incorretos'
        }
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorretos'
        }
      });
    }

    var token = jwt.sign({
      usuario: usuarioBD
    }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN
    });
    res.json({
      ok: true,
      usuario: usuarioBD,
      token: token
    });
  });
}); // configuraciones de google

function verify(token) {
  var ticket, payload;
  return regeneratorRuntime.async(function verify$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]

          }));

        case 2:
          ticket = _context.sent;
          payload = ticket.getPayload();
          return _context.abrupt("return", {
            nombre: payload.name,
            email: payload.email,
            img: payload.picture,
            google: true
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

app.post('/google', function _callee(req, res) {
  var token, googleUser;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          token = req.body.idtoken;
          _context2.next = 3;
          return regeneratorRuntime.awrap(verify(token)["catch"](function (error) {
            res.status(403).json({
              ok: false,
              error: error
            });
          }));

        case 3:
          googleUser = _context2.sent;
          Usuario.findOne({
            email: googleUser.email
          }, function (err, usuarioDB) {
            if (err) {
              return res.status(500).json({
                ok: false,
                err: err
              });
            }

            if (usuarioDB) {
              if (usuarioDB.google === false) {
                return res.status(400).json({
                  ok: false,
                  err: {
                    message: 'Debe usar su autenticacion normal'
                  }
                });
              } else {
                var _token = jwt.sign({
                  usuario: usuarioDB
                }, process.env.SEED, {
                  expiresIn: process.env.CADUCIDAD_TOKEN
                });

                return res.json({
                  ok: true,
                  usuario: usuarioDB,
                  token: _token
                });
              }
            } else {
              // si el susuario no existe en la base de datos
              var usuario = new Usuario();
              usuario.nombre = googleUser.nombre;
              usuario.email = googleUser.email;
              usuario.img = googleUser.img;
              usuario.google = true;
              usuario.password = ':)';
              usuario.save(function (error, usuarioDB) {
                if (error) {
                  return res.status(400).json({
                    ok: false,
                    error: error
                  });
                }

                var token = jwt.sign({
                  usuario: usuarioDB
                }, process.env.SEED, {
                  expiresIn: process.env.CADUCIDAD_TOKEN
                });
                return res.json({
                  ok: true,
                  usuario: usuarioDB,
                  token: token
                });
              });
            }
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = app;