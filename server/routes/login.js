const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!usuarioBD) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorretos'
                }
            })



        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorretos'
                }
            })



        }


        let token = jwt.sign({ usuario: usuarioBD },
            process.env.SEED,
            { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        })
    })


})


module.exports = app
