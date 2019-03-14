const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new mongoose.Schema({
    Cedula: {
        type: String,
        required: [true, "El campo de cédula es requerido"],
        unique: true
        //Acá podemos añadir una validación personalizada (una función)
    },
    RIF: {
        type: String,
        unique: true
    },
    Nombre: String,
    Apellido: String,
    Telefono: String,
    Email: String,
    FechaNacimiento: Date,
    Roles: [String],
    CreatedOn: {
        type: Date,
        default: Date.now
    },
    Concesionarios: [{type: Schema.Types.ObjectId, ref: 'Concesionario'}]
});

module.exports = mongoose.model('User', userSchema, 'C_Usuarios');