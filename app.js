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
var hospitalRoutes = require('./rutas/hospitales');
var medicoRoutes = require('./rutas/medicos');
var busquedaRoutes = require('./rutas/busqueda');
var uploadRoutes = require('./rutas/upload');
var archivoRoutes = require('./rutas/archivo');


//Conexion a la bsee de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if(err) throw err;
    console.log("Base de datos mongoDB: \x1b[36m%s\x1b[0m", 'online');  

});

//server index config
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//rutas

app.use('/usuarios',ususarioRoutes);
app.use('/upload',uploadRoutes);
app.use('/img',archivoRoutes);
app.use('/hospitales',hospitalRoutes);
app.use('/medicos',medicoRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/login',loginRoutes);
app.use('/',appRoutes);

//escuchar peticion
app.listen(3000,()=>{
    console.log("Servidor up 3000: \x1b[36m%s\x1b[0m", 'online');
});