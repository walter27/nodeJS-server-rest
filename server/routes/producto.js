const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { verficaToken, verificaRol } = require('../middlewares/autenticacion');



//===========================
//     Obtener Productos
//===========================
app.get('/productos', verficaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                })

            }


            res.json({
                ok: true,
                productos

            })


        })


})

//==============================
//     Obtener Producto por id
//==============================
app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoBD) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                })

            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                })
            }

            res.json({
                ok: true,
                productoBD

            })


        })
})



//===========================
//     Crear nuevo producto
//===========================
app.post('/producto', verficaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id


    })

    producto.save((err, productoBD) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })


    })
})



//===========================
//     Actualizar el produto
//===========================
app.put('/producto/:id', verficaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descProducto = {

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id

    }

    Producto.findByIdAndUpdate(id, descProducto, { new: true, runValidators: true }, (err, productoBD) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            })
        }

        res.json({
            ok: true,
            Producto: productoBD

        })

    })


})



//================================
//     Eliminar producto por id
//================================
app.delete('/producto/:id', [verficaToken, verificaRol], (req, res) => {

    let id = req.params.id;

    let cambiaDisponible = {

        disponible: false,
        usuario: req.usuario._id
    }

    Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoBD) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            })

        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })

    })
})

//================================
//     Buscar producto
//================================
app.get('/producto/buscar/:termino', verficaToken, (req, res) => {

    let termino = req.params.termino;

    //mandar expresion regular (i)=>insensible a las mayusculas y minusculas
    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                })

            }


            res.json({
                ok: true,
                productos

            })


        })

})
module.exports = app;
