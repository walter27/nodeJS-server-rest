"use strict";var monggose=require("mongoose"),unique=require("mongoose-unique-validator"),Schema=monggose.Schema,categoriaSchema=new Schema({nombre:{type:String,unique:!0,required:[!0,"La descripción es obligatoria"]},usuario:{type:Schema.Types.ObjectId,ref:"Usuario"}});categoriaSchema.plugin(unique,{message:"{PATH} debe ser unico"}),module.exports=monggose.model("Categoria",categoriaSchema);