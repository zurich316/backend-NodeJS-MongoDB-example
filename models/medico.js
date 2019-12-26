var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicolSchecma = new Schema({
    nombre:{ type:String, required:[true,"Nombre es requerido"]},
    img:{ type:String, required:false},
    usuario:{ type:Schema.Types.ObjectId, ref:"Usuario"},
    hospital:{ type:Schema.Types.ObjectId, 
               ref:"Hospital",
               required:[true,"El hospital es requerido"]
            },
});

module.exports = mongoose.model("Medico",medicolSchecma);