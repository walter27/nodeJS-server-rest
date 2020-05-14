var jwt = require('jsonwebtoken');

//==================================================
//          verificar token 
//==================================================

let verficaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            })
        }
        req.usuario = decode.usuario;
        next();


    })
}

//==================================================
//          verificar rol
//==================================================

let verificaRol = (req, res, next) => {


    let usuario = req.usuario;

    console.log(usuario.role);
    

    if (usuario.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })

    }




}




module.exports = {

    verficaToken,
    verificaRol
}