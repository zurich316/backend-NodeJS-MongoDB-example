//requires
var express =require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//inicializar valores
var app = express();

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//importar routes
var appRoutes = require('./rutas/app');
var ususarioRoutes = require('./rutas/usuarios');
var loginRoutes = require('./rutas/login');


//Conexion a la bsee de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log("Base de datos mongoDB: \x1b[36m%s\x1b[0m", 'online');  

});

//rutas

app.use('/usuarios',ususarioRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);

//escuchar peticion
app.listen(3000,()=>{
    console.log("Servidor up 3000: \x1b[36m%s\x1b[0m", 'online');
});