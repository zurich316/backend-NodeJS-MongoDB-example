var express =require('express');

var app = express();

var mdAutentificacion = require('../middlewares/autentificacion');

var Hospital = require('../models/hospitales');


//////////////////////////////
// Obtener hospitales
//////////////////////////////

app.get('/',(req,res,next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario','nombre email')
        .exec(
            (err,hospitales)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:"Error en al cargar hospitales",
                        errors:err
                    });
                }

                Hospital.count({},(err,total)=>{
                    res.status(200).json({
                        ok:true,
                        hospitales:hospitales,
                        total:total
                    });
                })
            }
        );
});


//////////////////////////////
// Crear
//////////////////////////////

app.post('/',mdAutentificacion.vericarToken ,(req,res)=>{
    
    var body = req.body;

    var hospital = new Hospital({
        nombre:body.nombre,
        usuario:req.usuario._id
    });

    hospital.save((err,hospitalGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:"Error al guardar hospital",
                errors:err
            });
        }

        res.status(201).json({
            ok:true,
            hospital:hospitalGuardado
        });
    
    });
});

//////////////////////////////
// Modificar 
//////////////////////////////
app.put('/:id',mdAutentificacion.vericarToken ,(req,res)=>{

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id,(err,hospital)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al buscar hospital",
                errors:err
            });
        }

        if(!hospital){
            return res.status(404).json({
                ok:false,
                mensaje:"Error, el hospital con el id "+id+" no existe",
                errors:{message:"El hospital no existe"}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar hospital",
                    errors:err
                });
            }

            res.status(200).json({
                ok:true,
                hospital:hospitalGuardado
            });

        });
    });
});

//////////////////////////////
// Borrar 
//////////////////////////////

app.delete('/:id',mdAutentificacion.vericarToken ,(req,res)=>{

    var id = req.params.id;

    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al borrar hospital",
                errors:err
            });
        }

        if(!hospitalBorrado){
            return res.status(404).json({
                ok:false,
                mensaje:"Error, el hospital con el id "+id+" no existe",
                errors:{message:"El hospital no existe"}
            });
        }

        res.status(200).json({
            ok:true,
            hospital:hospitalBorrado
        });
    });
});

module.exports = app;