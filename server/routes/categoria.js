const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const { verficaToken, verificaRol } = require('../middlewares/autenticacion');

app.get('/categorias', verficaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                })

            }


            res.json({
                ok: true,
                categorias
            })

        })
})

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaBD) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoriaBD

        })


    })
})

app.post('/categoria', verficaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaBD) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })



    })
})

app.put('/categoria/:id', verficaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        nombre: body.nombre
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaBD) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD

        })

    })
})

app.delete('/categoria/:id', [verficaToken, verificaRol], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD,
            message: {
                message: 'Categoria eliminada'

            }

        })

    })

})


module.exports = app;

