var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchecma = new Schema({
    nombre:{ type:String, required:[true,"Nombre es requerido"]},
    img:{ type:String, required:false},
    usuario:{ type:Schema.Types.ObjectId, ref:"Usuario"},
},{collection:'hospitales'});

module.exports = mongoose.model("Hospital",hospitalSchecma);