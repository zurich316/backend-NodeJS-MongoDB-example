var express =require('express');

var app = express();

var mdAutentificacion = require('../middlewares/autentificacion');

var Medico = require('../models/medico');


//rutas

//////////////////////////////
// Obtener todos los medicos
//////////////////////////////

app.get('/',(req,res,next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario','nombre email')
        .populate('hospital')
        .exec(
            (err,medicos)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:"Error en al cargar medicos",
                        errors:err
                    });
                }

                Medico.count({},(err,total)=>{
                    res.status(200).json({
                        ok:true,
                        medicos:medicos,
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

    var medico = new Medico({
        nombre:body.nombre,
        usuario:req.usuario._id,
        hospital:body.hospital
    });

    medico.save((err,medicoGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:"Error al guardar medico",
                errors:err
            });
        }

        res.status(201).json({
            ok:true,
            medico:medicoGuardado
        });
    
    });
});

//////////////////////////////
// Modificar 
//////////////////////////////
app.put('/:id',mdAutentificacion.vericarToken ,(req,res)=>{

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id,(err,medico)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al buscar medico",
                errors:err
            });
        }

        if(!medico){
            return res.status(404).json({
                ok:false,
                mensaje:"Error, el medico con el id "+id+" no existe",
                errors:{message:"El medico no existe"}
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospital

        medico.save((err, medicoGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar medico",
                    errors:err
                });
            }

            res.status(200).json({
                ok:true,
                medico:medicoGuardado
            });

        });
    });
});

//////////////////////////////
// Borrar 
//////////////////////////////

app.delete('/:id',mdAutentificacion.vericarToken ,(req,res)=>{

    var id = req.params.id;

    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al borrar medico",
                errors:err
            });
        }

        if(!medicoBorrado){
            return res.status(404).json({
                ok:false,
                mensaje:"Error, el medico con el id "+id+" no existe",
                errors:{message:"El medico no existe"}
            });
        }

        res.status(200).json({
            ok:true,
            medico:medicoBorrado
        });
    });
});

module.exports = app;