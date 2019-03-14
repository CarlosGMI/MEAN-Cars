let concesionarioModel = require('../../models/concesionarioModel');

//Creación de un concesionario
exports.createConcesionario = function(req, res){
    //Si el body del POST request viene vacío responde con error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0)
        return res.json({success: false, message: "Por favor, llene el formulario"});
    let concesionario = new concesionarioModel(req.body); //Creamos el concesionario que se añadirá en base de datos
    concesionario.save().then(doc => {
        if(!doc || doc.length === 0)
            return res.json({success: false, message: "Ha ocurrido un error al registrar un concesionario", model: null});
        return res.json({success: true, message: "El concesionario se ha registrado exitosamente", model: null});
    }).catch(err => {
        if(err.code === 11000)
            return res.json({success: false, message: "Este concesionario ya ha sido registrado anteriormente", model: concesionario});
        let errors = [];
        for(let errName in err.errors){
            errors.push({name: errName, message: err.errors[errName].message});
        }
        return res.json({success: false, message: errors, model: null});
    });
};

//Consulta de todos los concesionarios
exports.getConcesionarios = function(req, res){
    
};