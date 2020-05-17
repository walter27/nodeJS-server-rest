const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            oh: false,
            err: {
                message: 'No se ha selecionado ningun archivo'
            }
        })
    }


    //VALIDAR TIPO
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son ' + tiposValidos.join(', ')

            }
        })



    }


    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    //EXTENSIONES PERMITIDAS
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })

    }

    //CAMBIAR NOMBRE DEL ARCHIVO- DEBE SER UNICO Y AGREGARLE ALGO PARA PREVENIR EL CACHE DE NAVEGADOR
    let nombreArchivo2 = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`../uploads/${tipo}/${nombreArchivo2}`, (err) => {
        if (err)
            return res.status(500).json({
                err: false,
                err
            })

        //IMAGEN CARGADO EN EL FILE SYSTEM

        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo2);

        } else {
            imagenProducto(id, res, nombreArchivo2);


        }



    });


})


function imagenUsuario(id, res, nombreArchivo2) {

    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borrarArchivo(nombreArchivo2, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!usuarioBD) {

            borrarArchivo(nombreArchivo2, 'usuarios')
            return res.status(400).json({

                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioBD.img, 'usuarios')

        usuarioBD.img = nombreArchivo2;

        usuarioBD.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo2
            })
        })
    })



}
function imagenProducto(id, res, nombreArchivo2) {


    Producto.findById(id, (err, productoBD) => {

        if (err) {

            borrarArchivo(nombreArchivo2, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!productoBD) {

            borrarArchivo(nombreArchivo2, 'productos')
            return res.status(400).json({

                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }


        borrarArchivo(productoBD.img, 'productos')

        productoBD.img = nombreArchivo2;

        productoBD.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo2
            })
        })


    })



}


function borrarArchivo(nombreImagne, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagne}`)

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }



}

module.exports = app;