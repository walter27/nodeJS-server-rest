"use strict";var mongoose=require("mongoose"),Schema=mongoose.Schema,productoSchema=new Schema({nombre:{type:String,required:[!0,"El nombre es necesario"]},precioUni:{type:Number,required:[!0,"El precio únitario es necesario"]},descripcion:{type:String,required:!1},disponible:{type:Boolean,required:!0,default:!0},categoria:{type:Schema.Types.ObjectId,ref:"Categoria",required:!0},usuario:{type:Schema.Types.ObjectId,ref:"Usuario"}});module.exports=mongoose.model("Producto",productoSchema);