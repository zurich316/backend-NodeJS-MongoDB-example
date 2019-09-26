//requires
var express =require('express');
var mongoose = require('mongoose');
//inicializar valores
var app = express();

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log("Base de datos mongoDB: \x1b[36m%s\x1b[0m", 'online');  

});

//rutas
app.get('/',(req,res,next)=>{
    res.status(200).json({
        mensaje:"Mensaje correctamente",
        ok:true
    });

});

//escuchar peticion
app.listen(3000,()=>{
    console.log("Servidor up 3000: \x1b[36m%s\x1b[0m", 'online');
});