const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verficaToken, verificaRol } = require('../middlewares/autenticacion')



app.get('/usuario', verficaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 17;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    error
                })

            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                })

            })



        })
})

app.post('/usuario', [verficaToken, verificaRol], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {
        if (error) {

            return res.status(400).json({
                ok: false,
                error
            })

        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})

app.put('/usuario/:id', [verficaToken, verificaRol], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })

        }

        res.json({
            ok: true,
            usuario: usuarioDB

        })

    })


})

app.delete('/usuario/:id', [verficaToken, verificaRol], (req, res) => {

    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, usuarioBD) => {

    let cambiaEstado = {

        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBD) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })

        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        })

    })

})


module.exports = app
