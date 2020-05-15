"use strict";var express=require("express"),app=express(),Categoria=require("../models/categoria"),_require=require("../middlewares/autenticacion"),verficaToken=_require.verficaToken,verificaRol=_require.verificaRol;app.get("/categorias",verficaToken,function(e,o){Categoria.find({}).sort("nombre").populate("usuario","nombre email").exec(function(e,r){if(e)return o.status(500).json({ok:!1,err:e});o.json({ok:!0,categorias:r})})}),app.get("/categoria/:id",function(e,o){var r=e.params.id;Categoria.findById(r,function(e,r){return e?o.status(500).json({ok:!1,err:e}):r?void o.json({ok:!0,categoriaBD:r}):o.status(400).json({ok:!1,err:{message:"El id no existe"}})})}),app.post("/categoria",verficaToken,function(e,o){var r=e.body;new Categoria({nombre:r.nombre,usuario:e.usuario._id}).save(function(e,r){return e?o.status(500).json({ok:!1,err:e}):r?void o.json({ok:!0,categoria:r}):o.status(400).json({ok:!1,err:e})})}),app.put("/categoria/:id",verficaToken,function(e,o){var r=e.params.id,a={nombre:e.body.nombre};Categoria.findByIdAndUpdate(r,a,{new:!0,runValidators:!0},function(e,r){return e?o.status(500).json({ok:!1,err:e}):r?void o.json({ok:!0,categoria:r}):o.status(400).json({ok:!1,err:e})})}),app.delete("/categoria/:id",[verficaToken,verificaRol],function(e,o){var r=e.params.id;Categoria.findByIdAndRemove(r,function(e,r){return e?o.status(500).json({ok:!1,err:e}):r?void o.json({ok:!0,categoria:r,message:{message:"Categoria eliminada"}}):o.status(400).json({ok:!1,err:{message:"el id no existe"}})})}),module.exports=app;