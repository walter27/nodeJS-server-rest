const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


// configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }


}


app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(error => {
            res.status(403).json({
                ok: false,
                error
            })
        })

        
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                })



            } else {

                let token = jwt.sign({ usuario: usuarioDB },
                    process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({

                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {

            // si el susuario no existe en la base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';


            usuario.save((error, usuarioDB) => {
                if (error) {

                    return res.status(400).json({
                        ok: false,
                        error
                    })

                }


                let token = jwt.sign({ usuario: usuarioDB },
                    process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({

                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })


        }






    })


})


module.exports = app
