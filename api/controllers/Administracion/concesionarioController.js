let concesionarioModel = require('../../models/concesionarioModel');
let ObjectId = require('mongodb').ObjectId

//======================Creación de un concesionario======================
exports.createConcesionario = function(req, res){
    //Si el body del POST request viene vacío responde con error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0)
        return res.json({success: false, message: "Por favor, llene el formulario"});
    //Creamos el concesionario que se añadirá en base de datos
    let concesionario = new concesionarioModel(req.body);
    //Guardamos el concesionario en la base de datos 
    concesionario.save().then(doc => {
        //Si el documento que retorna el guardado es null o vacío responde con error. Si no, registro exitoso
        if(!doc || doc.length === 0)
            return res.json({success: false, message: "Ha ocurrido un error al registrar un concesionario", model: null});
        return res.json({success: true, message: "El concesionario se ha registrado exitosamente", model: null});
        //Capturamos cualquier error durante el guardado en base de datos    
    }).catch(err => {
        //Si el error es de duplicación de datos responde con error. Si no, añade cualquier error a un array de mensajes de error.
        if(err.code === 11000)
            return res.json({success: false, message: "Este concesionario ya ha sido registrado anteriormente", model: null});
        let errors = [];
        for(let errName in err.errors){
            errors.push({name: errName, message: err.errors[errName].message});
        }
        return res.json({success: false, message: errors, model: null});
    });
};

//======================Obtener todos los concesionarios======================
exports.getConcesionarios = function (req, res) {
    //Objeto que representa el query de búsqueda sobre los concesionarios
    let query = {};
    //Si el usuario filtró por región el query incluirá esa búsqueda
    if(req.query.region)
        query = {Region: req.query.region};
    //Buscamos los concesionarios de acuerdo al query y los ordenamos por Región y luego por Nombre
    concesionarioModel.find(query).sort({Region: 1, Nombre: 1}).then(doc => {
        //Si la búsqueda no retorna nada es porque no hay concesionarios registrados bajo esa búsqueda. Caso contrario retorna el resultado en un JSON 
        if(!doc || doc.length === 0)
            return res.json({success: true, message: "No hay concesionarios registrados", model: doc});
        return res.json({success: true, message: "", model: doc});
    //Capturamos cualquier error durante la búsqueda del concesionario
    }).catch(err => {
        res.status(500).json({success: false, message: err.message, model: null});
    });
};

//======================Modificar un concesionario determinado======================
exports.updateConcesionario = function(req, res){
    //Si el body del POST request (formulario) está vacío retorna un error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0)
        return res.json({success: false, message: "Por favor, llene el formulario"});
    //Transformamos a ObjectID el parámetro del URL 
    let id = new ObjectId(req.params.id);
    //Buscamos el concesionario que corresponda con el ObjectId y actualizamos el documento con el req.body; asegurándonos de ejecutar las validaciones del esquema 
    concesionarioModel.findOneAndUpdate({ _id: {$eq: id} }, req.body, {runValidators: true}).then(doc => {
        //Si la búsqueda no retorna nada es porque no existe el concesionario con el ObjectId especificado (solo para aquellos vivos que ingresen cualquier param en el URL)
        if (!doc || doc.length === 0)
            return res.json({ success: true, message: "No existe el concesionario a modificar" });
        return res.json({ success: true, message: "El concesionario se ha modificado exitosamente" });
    //Capturamos cualquier error durante la modificación del concesionario
    }).catch(err => {
        //Si el error es de duplicación de datos responde con error. Si no, añade cualquier error a un array de mensajes de error.
        if(err.code === 11000)
            return res.json({success: false, message: "El RIF que está intentando modificar ya existe"});
        let errors = [];
        for(let errName in err.errors){
            errors.push({name: errName, message: err.errors[errName].message});
        }
        return res.json({success: false, message: errors});
    });
};

//======================Buscar un concesionario por nombre======================
exports.searchConcesionarioPorNombre = function(req, res){
    //Si el parámetro de query viene vacío se retorna un error porque el usuario no ha llenado el campo de búsqueda
    if(!req.query.name)
        return res.json({success: false, message: "Por favor, especifica el nombre del concesionario a buscar"});
    //Buscamos los concesionarios cuyo Nombre contenga el string de búsqueda, ignorando letras mayúsculas y ordenándolos por Región y luego por Nombre    
    concesionarioModel.find({Nombre: {$regex: req.query.name, $options: 'i'}})
    .sort({Region: 1, Nombre: 1}).then(doc => {
        //Si el resultado está vacío es porque no se encontraron resultados. Caso contrario retorna los resultados en un JSON
        if (!doc || doc.length === 0)
            return res.json({ success: false, message: "No se encontraron resultados", model: null });
        return res.json({success: true, message: "", model: doc});
    //Capturamos cualquier error en la búsqueda del concesionario
    }).catch(err => {
        return res.status(505).json({success: false, message: err.message, model: null});
    });
};

//======================Eliminar un concesionario determinado======================
exports.deleteConcesionario = function(req, res){
    if(!req.params.id)
        return res.json({success: false, message: "Por favor, selecciona un concesionario a eliminar"});
    //Transformamos a ObjectID el parámetro del URL 
    let id = new ObjectId(req.params.id);
    concesionarioModel.findOneAndDelete({_id: id}).then(doc => {
        //Si la búsqueda no retorna nada es porque no existe el concesionario con el ObjectId especificado (solo para aquellos vivos que ingresen cualquier param en el URL)
        if (!doc || doc.length === 0)
            return res.json({ success: true, message: "No existe el concesionario a modificar" });
        return res.json({ success: true, message: "El concesionario se ha eliminado exitosamente" });
    }).catch(err => {
        return res.status(505).json({success: false, message: err.message, model: null});
    });
};