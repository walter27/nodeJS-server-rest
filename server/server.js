require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion del index para las ruta global
app.use(require('./routes/index'));

//dstabase mongoose
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {

    if (err) throw err;
    console.log('Base de datos conectada');

});


app.listen(process.env.PORT, () => {

    console.log('Servidor desplegado');

})