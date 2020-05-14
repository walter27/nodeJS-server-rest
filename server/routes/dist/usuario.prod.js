"use strict";var express=require("express"),app=express(),Usuario=require("../models/usuario"),bcrypt=require("bcrypt"),_=require("underscore"),_require=require("../middlewares/autenticacion"),verficaToken=_require.verficaToken,verificaRol=_require.verificaRol;app.get("/usuario",verficaToken,function(r,i){var e=r.query.desde||0;e=Number(e);var o=r.query.limite||5;o=Number(o),Usuario.find({estado:!0},"nombre email role estado google img").skip(e).limit(o).exec(function(r,o){if(r)return i.status(400).json({ok:!1,error:error});Usuario.count({estado:!0},function(r,e){i.json({ok:!0,usuarios:o,cantidad:e})})})}),app.post("/usuario",[verficaToken,verificaRol],function(r,o){var e=r.body;new Usuario({nombre:e.nombre,email:e.email,password:bcrypt.hashSync(e.password,10),role:e.role}).save(function(r,e){if(r)return o.status(400).json({ok:!1,error:r});o.json({ok:!0,usuario:e})})}),app.put("/usuario/:id",[verficaToken,verificaRol],function(r,o){var e=r.params.id,i=_.pick(r.body,["nombre","email","img","role","estado"]);Usuario.findByIdAndUpdate(e,i,{new:!0,runValidators:!0},function(r,e){if(r)return o.status(400).json({ok:!1,err:r});o.json({ok:!0,usuario:e})})}),app.delete("/usuario/:id",[verficaToken,verificaRol],function(r,o){var e=r.params.id;Usuario.findByIdAndUpdate(e,{estado:!1},{new:!0},function(r,e){return r?o.status(400).json({ok:!1,err:r}):e?void o.json({ok:!0,usuario:e}):o.status(400).json({ok:!1,err:{message:"Usuario no encontrado"}})})}),module.exports=app;