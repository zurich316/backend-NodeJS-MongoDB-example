var express =require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');

var Hospital = require('../models/hospitales')
var Medico = require('../models/medico')
var Usuario = require('../models/usuario')

// default options
app.use(fileUpload());

//rutas
app.put('/:tipo/:id',(req,res,next)=>{

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tipoValidas = ['hospitales','medicos','usuarios'];

    if(tipoValidas.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            mensaje:"Error tipo no valida",
            errors:{message:"Debe seleccionar con formato: " + tipoValidas.join(', ')}
        });
    }
    
    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje:"Error selecciono nada",
            errors:{message:"Debe seleccionar una imagen"}
        });
    }

    var archivo = req.files.imagen;

    var archivoCortado = archivo.name.split('.');
    var extension = archivoCortado[archivoCortado.length - 1];

    var extesionesValidas = ['jpg','png','gif','jpeg'];

    if(extesionesValidas.indexOf(extension)<0){
        return res.status(400).json({
            ok:false,
            mensaje:"Erroro extension no valida",
            errors:{message:"Debe seleccionar una imagen con formato: " + extesionesValidas.join(', ')}
        });
    }

    //ruta de la imagen
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //mover archivo de temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path,err=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje:"Erroro extension no valida",
                errors:err
            });
        }

        subirPorTipo(tipo,id,nombreArchivo, res);
    });
});

function subirPorTipo(tipo,id,nombreArchivo, res) {
    
    if(tipo === "usuarios"){
    
        Usuario.findById(id,(err,usuario)=>{

            if(!usuario){
                borrarImagen(`./uploads/${tipo}/${nombreArchivo}`);
                return res.status(404).json({
                    ok:false,
                    mensaje:"Error ,usuario no encontrado"
                });
            }
            var pathViejo = './uploads/usuarios/'+usuario.img;
            
            //borrar si existe
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            usuario.save((err,actualizado)=>{

                return res.status(200).json({
                    ok:true,
                    mensaje:"Imagen usuario actualizado",
                    usuario:actualizado
                });
                
            });


        })
    }


    if(tipo === "hospitales"){


        Hospital.findById(id,(err,hospital)=>{
            
            if(!hospital){

                borrarImagen(`./uploads/${tipo}/${nombreArchivo}`);
                return res.status(404).json({
                    ok:false,
                    mensaje:"Error ,hospital no encontrado"
                });
            }

            var pathViejo = './uploads/hospitales/'+hospital.img;
            
            //borrar si existe
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            hospital.save((err,actualizado)=>{

                return res.status(200).json({
                    ok:true,
                    mensaje:"Imagen hospital actualizado",
                    hospital:actualizado
                });
                
            });


        })        

    }


    if(tipo === "medicos"){
        Medico.findById(id,(err,medicos)=>{

            if(!medicos){
                borrarImagen(`./uploads/${tipo}/${nombreArchivo}`);
                return res.status(404).json({
                    ok:false,
                    mensaje:"Error ,medicos no encontrado"
                });
            }

            var pathViejo = './uploads/medicos/'+medicos.img;
            
            //borrar si existe
            borrarImagen(pathViejo);

            medicos.img = nombreArchivo;
            medicos.save((err,actualizado)=>{

                return res.status(200).json({
                    ok:true,
                    mensaje:"Imagen medicos actualizado",
                    medicos:actualizado
                });
                
            });


        })
    }

    function borrarImagen(pathViejo) {
        if (fs.existsSync(pathViejo)) {
            fs.unlinkSync(pathViejo);
        }
    }
    // res.status(400).json({
    //     ok:false,
    //     mensaje:"error, algo paso",
    // });

}

module.exports = app;