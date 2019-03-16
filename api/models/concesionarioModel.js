const mongoose = require('mongoose');

let concesionarioSchema = new mongoose.Schema({
    Nombre: String,
    RIF: {
        type: String,
        required: [true, 'El campo de RIF es requerido'],
        unique: true
    },
    Region: { //Las regiones deberían ser más escalables en grandes sistemas.
        type: String,
        required: [true, 'El campo de Región es requerido']
    },
    CreatedOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Concesionario', concesionarioSchema, 'C_Concesionario');