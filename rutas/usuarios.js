var express =require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutentificacion = require('../middlewares/autentificacion');

var app = express();

var Usuario = require('../models/usuario');

//////////////////////////////
// Obtener todos los usuarios
//////////////////////////////

app.get('/',(req,res,next)=>{

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({},"nombre email img role")
        .skip(desde)
        .limit(5)
        .exec(
            (err,usuarios)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:"Error en mongoBD",
                        errors:err
                    });
                }

                Usuario.count({},(err,total)=>{
                    res.status(200).json({
                        ok:true,
                        usuarios:usuarios,
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

    var usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password, 10),
        img:body.img,
        role:body.role,  
    });

    usuario.save((err,usuarioGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:"Error al guardar usuario",
                errors:err
            });
        }

        res.status(201).json({
            ok:true,
            usuario:usuarioGuardado
        });
    
    });
});

//////////////////////////////
// Modificar 
//////////////////////////////
app.put('/:id',mdAutentificacion.vericarToken ,(req,res)=>{

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id,(err,usuario)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al buscar usuario",
                errors:err
            });
        }

        if(!usuario){
            return res.status(404).json({
                ok:false,
                mensaje:"Error, el usuario con el id "+id+" no existe",
                errors:{message:"El usuario no existe"}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    mensaje:"Error al actualizar usuario",
                    errors:err
                });
            }

            usuarioGuardado.password = ":)";

            res.status(200).json({
                ok:true,
                usuario:usuarioGuardado
            });

        });
    });
});

//////////////////////////////
// Borrar 
//////////////////////////////

app.delete('/:id',mdAutentificacion.vericarToken ,(req,res)=>{

    var id = req.params.id;

    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al borrar usuario",
                errors:err
            });
        }

        if(!usuarioBorrado){
            return res.status(404).json({
                ok:false,
                mensaje:"Error, el usuario con el id "+id+" no existe",
                errors:{message:"El usuario no existe"}
            });
        }

        res.status(200).json({
            ok:true,
            usuario:usuarioBorrado
        });
    });
});

module.exports = app;