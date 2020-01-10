var express =require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

//google
var client_ID = require('../config/config').Client_ID;
const {OAuth2Client} = require('google-auth-library');
var client = new OAuth2Client(client_ID);


/////////////////////
// Auth Google
/////////////////////

async function verify(token) {
    var ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    var payload = ticket.getPayload();
    //var userId = payload['sub'];

    return {
        nombre:payload.name,
        img:payload.picture,
        email:payload.email,
        google:true
    };

    // If request specified a G Suite domain:
    //const domain = payload['hd'];
};

app.post('/google', async (req,res)=>{

    token = req.body.token;

    var googleUser = await verify(token)
        .catch(e=>{
            return res.status(403).json({
                ok:false,
                mensaje:"Token no valido",
            });
    });

    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{   
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al buscar usuario",
                errors:err
            });
        }

        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(500).json({
                    ok:false,
                    mensaje:"Utilice el metodo de autentificacion con contraseña",
                });
            }else{

                var token =jwt.sign({usuario:usuarioDB},SEED,{expiresIn:14400});
                return res.status(200).json({
                    ok:true,
                    messgae:'Loggin funciona',
                    token:token
                });
            }
        }else{
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.password = '...';
            usuario.google = true;

            usuario.save((err,usuarioDB)=>{
                var token =jwt.sign({usuario:usuarioDB},SEED,{expiresIn:14400});

                res.status(200).json({
                    ok:true,
                    messgae:'Loggin funciona',
                    body:usuarioDB,
                    token:token
                });
            });

        }
    });

    // res.status(200).json({
    //     ok:true,
    //     google: googleUser
    // });
})

/////////////////////
// Auth Normal
/////////////////////

app.post('/',(req,res)=>{

    var body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje:"Error al buscar usuario",
                errors:err
            });
        }

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                mensaje:"Error con los credenciales del usuario",
                errors:err
            });
        }

        if( !bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                mensaje:"Error con los credenciales del usuario",
                errors:err
            });
        }


        //crear un token
        usuarioDB.password = ":D";
        var token =jwt.sign({usuario:usuarioDB},SEED,{expiresIn:14400});

        res.status(200).json({
            ok:true,
            messgae:'Loggin funciona',
            body:usuarioDB,
            token:token
        });
    });

});

module.exports = app;