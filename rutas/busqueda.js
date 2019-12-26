var express =require('express');

var app = express();

var Hospitales = require('../models/hospitales')
var Medicos = require('../models/medico')
var Usuarios = require('../models/usuario')

//rutas



app.get('/colleccion/:tabla/:busqueda',(req,res,next)=>{
    var busqueda = req.params.busqueda;
    var regex = RegExp(busqueda,'i');

    var tabla = req.params.tabla;

    switch (tabla) {
        case "medicos":
            promesa = buscarMedicos(regex)
            break;
        case "hospitales":
            promesa = buscarHospitales(regex)
            break;
        case "usuarios":
            promesa = buscarUsuarios(regex)
            break;
    
        default:
            res.status(200).json({
                ok:false,
                mensaje:"Los unicos valores validos son medicos, hospitales, usuarios",
                error: {mensaje:"Tipo de coleccion/tabla no es valido"}
            })
        break;
    }

    promesa.then(resp=>{
        res.status(200).json({
            ok:true,
            [tabla]:resp
        });
    });
})

app.get('/todo/:busqueda',(req,res,next)=>{
    var busqueda = req.params.busqueda;
    var regex = RegExp(busqueda,'i');

    Promise.all([ 
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex),
    ]).then(resp=>{
        res.status(200).json({
            ok:true,
            hospitales:resp[0],
            medicos:resp[1],
            usuarios:resp[2]
        });

    })

});

function buscarHospitales(regex){

    return new Promise((resolve,reject)=>{
        Hospitales.find({nombre:regex})
                    .populate('usuario','nombre email')
                    .exec((err,hospitales)=>{
                        if(err){
                            reject("error al cargar hospitales",err);
                        }
                        resolve(hospitales)
                    })
    });
}

function buscarMedicos(regex){

    return new Promise((resolve,reject)=>{
        Medicos.find({nombre:regex})
                .populate('usuario','nombre email')
                .populate('hospital','nombre')
                .exec((err,medicos)=>{
                    if(err){
                        reject("error al cargar medicos",err);
                    }
                    resolve(medicos)
                })
    });
}

function buscarUsuarios(regex){

    return new Promise((resolve,reject)=>{
        Usuarios.find({},"nombre email role")
                .or([{'nombre':regex},{'email':regex}])
                .exec({nombre:regex},(err,usuarios)=>{
                    if(err){
                        reject("error al cargar usuarios",err);
                    }
                    resolve(usuarios)
                })
    });
}

module.exports = app;