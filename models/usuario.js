var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos ={
    values:['ADMIN_ROLE','USER_ROLE'],
    message:"{VALUE} no es un rol valido"
};

var usuarioSchecma = new Schema({
    nombre:{ type:String, required:[true,"Nombre es requerido"]},
    email:{ type:String, unique:true, required:[true,"Correo es requerido"]},
    password:{ type:String, required:[true,"Password es requerido"]},
    img:{ type:String, required:false},
    role:{ type:String, required:true, default:"USER_ROLE", enum:rolesValidos},
});

usuarioSchecma.plugin(uniqueValidator,{message:'el {PATH} debe seer unico'});

module.exports = mongoose.model("Usuario",usuarioSchecma);