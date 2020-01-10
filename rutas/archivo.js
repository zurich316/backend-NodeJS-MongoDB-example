var express =require('express');

var app = express();

var path = require('path');
var fs = require('fs');

//rutas
app.get('/:tipo/:img',(req,res,next)=>{

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImg = path.resolve(__dirname,`../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg)
    }else{
        var noImg = path.resolve(__dirname,`../assets/no-img.jpg`);
        res.sendFile(noImg);
    }

});

module.exports = app;