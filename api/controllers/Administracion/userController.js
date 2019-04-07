let userModel = require('../../models/userModel');
let concesionarioModel = require('../../models/concesionarioModel');
let ObjectId = require('mongodb').ObjectId

//======================Obtener todos los usuarios (clientes) registrados en el sistema======================
exports.getClientes = async function(req, res){
    try{
        /* Obtenemos los usuarios que tengan el rol de Cliente (a excepción de sus contraseñas) y los ordenamos por 
        nombre y apellido. A su vez, se llena la información correspondiente a los concesionarios de cada usuario,
        organizados a su vez por región a la que pertenecen y su nombre */
        let users = await userModel.find({Roles: "Cliente"}, {Contrasena: 0}).sort({Nombre: 1, Apellido: 1})
        .populate('Concesionarios', 'Nombre Region', null, {sort: {'Region': 1, 'Nombre': 1}});
        //Si esta búsqueda retorna vacía es porque no existe algún cliente registrado en el sistema
        if(!users || users.length === 0)
            return res.json({success: true, message: "No hay clientes registrados", model: null});
        //Si el parámetro de filtrado se encuentra lleno necesitamos filtrar la búsqueda de usuarios realizada anteriormente
        if(req.query.region){
            //Array de usuarios que se retornará al front-end
            let usersToReturn = [];
            //Para cada usuario en la lista de todos los usuarios
            users.forEach(user => {
                //Objeto que representa el usuario que pertenece a la región dada en el req.query
                let userFiltered = null;
                //Los concesionarios del usuario que pertenece a la región del req.query
                let userConcesionarios = [];
                //Para cada concesionario de la lista de concesionarios de un usuario
                user.Concesionarios.forEach(concesionario => {
                    /*Si la región del concesionario es la región del req.query extrae el usuario y los 
                    concesionarios pertenecientes a la región del req.query*/
                    if(concesionario.Region === req.query.region){
                        userFiltered = user;
                        userConcesionarios.push(concesionario);
                        userFiltered.Concesionarios = userConcesionarios;
                    }
                });
                //Si hay un usuario dentro de la región dada por el req.query adjúntalo al array que se retorna al front-end
                if(userFiltered)
                    usersToReturn.push(userFiltered);
            });
            //Si el array de usuarios que pertenecen a la región dada en el req.query está vacío es porque no hay clientes en dicha región
            if(usersToReturn.length === 0)
                return res.json({success: true, message: "No se encontraron clientes en la región especificada", model: null});
            //Todo correcto, retorna al front-end el array de usuarios que pertenecen a la región del req.query
            return res.json({success: true, message: "", model: usersToReturn});    
        }
        //Si req.query viene vacío retorna la búsqueda de todos los usuarios al front-end
        return res.json({success: true, message: "", model: users});
    //Capturamos cualquier error que se presente en la búsqueda de los usuarios o en el filtrado de los mismos
    }catch(err){
        return res.status(500).json({success: false, message: err.message, model: null});
    }
};

//======================Buscar un usuario (cliente) por cédula o correo======================
exports.searchCliente = function(req, res){
    //Si los parámetros de búsqueda no existen es porque el usuario presionó el botón de buscar con el campo vacío
    if(!req.query.search)
        return res.json({success: false, message: "Por favor, especifica la cédula o el correo a buscar", model: null});
    //Obtenemos los usuarios cuyas cédulas o correos contengan el parámetro de búsqueda colocado por el usuario    
    userModel.findOne({$or: [{Cedula: {$regex: req.query.search}},{Email: {$regex: req.query.search, $options: 'i'}}]}, {Contrasena: 0})
    .populate('Concesionarios', 'Nombre Region').then(doc => {
        //Si la búsqueda está vacía es porque no existe un usuario con la cédula o el correo introducido
        if(!doc || doc.length === 0)
            return res.json({success: true, message: "No se encontraron resultados", model: null});
        //Todo correcto, retornamos el usuario al front-end
        return res.json({success: true, message: "", model: doc});
    //Capturamos cualquier error durante la búsqueda del usuario
    }).catch(err => {
        return res.status(500).json({success: false, message: err.message, model: null});
    });
};

//======================Modificar los roles de un usuario (cliente)======================
exports.updateCliente = function(req, res){
    if(!req.body.roles)
        return res.json({success: false, message: "Selecciona al menos un rol"});
    //Transformamos a ObjectID el parámetro del URL 
    let id = new ObjectId(req.params.id);
    //Buscamos el usuario de acuerdo al ObjectID y actualizamos sus roles
    userModel.findOneAndUpdate({_id: id},{Roles: req.body.roles},{runValidators: true}).then(doc => {
        if(!doc || doc.length === 0)
            return res.json({success: true, message: "El usuario a modificar no se encuentra registrado en el sistema"});
        return res.json({success: true, message: "Roles modificados exitosamente"})
    }).catch(err => {
        return res.json({success: false, message: err.message})
    });
};

//======================Eliminar un concesionario de un usuario (cliente)======================
exports.deleteConcesionario = async function(req, res){
    //Si los parámetros para esta ruta vienen vacíos se responde con un error
    if(!req.params.idConcesionario || !req.params.idCliente)
        return res.json({success: false, message: "No ha sido seleccionado el cliente o el concesionario"});
    //Se transforman a ObjectID los parámetros recibidos en el req
    let idCliente = new ObjectId(req.params.idCliente);
    let idConcesionario = new ObjectId(req.params.idConcesionario);
    try{
        //Comprobamos que el usuario correspondiente al _id del req existe (seleccionamos solo los concesionarios para no hacer tan pesada la consulta)
        let userExists = await userModel.find({_id: idCliente}, {Concesionarios: 1});
        //Si la búsqueda del usuario no retorna nada es porque el usuario no existe
        if(!userExists || userExists.length === 0)
            return res.json({success: false, message: "El usuario seleccionado no existe", model: null});
        //Comprobamos que el concesionario correspondiente al _id del req existe (seleccionamos solo su ID para no hacer tan pesada la consulta)
        let concesionarioExists = await concesionarioModel.find({_id: idConcesionario}, {_id: 1});
        //Si el concesionario no retorna nada es porque el concesionario no existe
        if(!concesionarioExists || concesionarioExists.length === 0)
            return res.json({success: false, message: "El concesionario seleccionado no existe", model: null});
        /*Si el array de concesionarios del usuario encontrado previamente tiene 1 concesionario no se puede 
        eliminar porque el cliente debe tener al menos 1 concesionario asociado (ESTA ES UNA VALIDACIÓN QUE PUEDE 
        OPTIMIZARSE CON UN CUSTOM VALIDATOR EN EL MODELO Y HACIENDO: runValidators: true EN EL findOneAndUpdate pero
        por alguna razón no me funcionan los custom validators en el array o generan alguna incompatibilidad con el $pull)*/
        if(userExists[0].Concesionarios.length == 1)
            return res.json({success: false, message: "El usuario seleccionado debe tener al menos un concesionario asociado", model: null});
        //Buscamos todos los campos del cliente (excepto Contraseña) y eliminamos el concesionario del array de concesionarios del cliente y retornamos el documento modificado (new: true)
        let userModified = await userModel.findOneAndUpdate({_id: idCliente}, {$pull: {Concesionarios: idConcesionario}}, {new: true, fields: {Contrasena: 0}})
        //Todo correcto, retornamos el documento modificado al front-end
        return res.json({success: true, message: "Concesionario removido con éxito", model: userModified});
    //Capturamos cualquier error que surga en alguno de los queries    
    }catch(err){
        return res.json({success: false, message: err.message, model: null});
    }
};

//======================Agregar un concesionario a un usuario (cliente)======================
exports.addConcesionario = async function(req, res){
    //Si el parámetro viene vacío se responde con error
    if(!req.params.id)
        return res.json({success: false, message: "No ha sido seleccionado el cliente", model: null});
    //Si el body viene vacío es porque no se ha seleccionado ningún concesionario en el front-end
    if(!req.body.concesionario || req.body.concesionario === 0)
        return res.json({success: false, message: "Por favor, selecciona un concesionario", model: null});
    //Convertimos a ObjectID el parámetro correspondiente al ID del cliente y al ID del concesionario
    let idCliente = new ObjectId(req.params.id);
    let idConcesionario = new ObjectId(req.body.concesionario);
    try{
        //Buscamos al cliente y agregamos, de no existir previamente, el nuevo concesionario ($addToSet) retornando el documento modificado sin la contraseña
        let userModified = await userModel.findOneAndUpdate({_id: idCliente}, {$addToSet: {Concesionarios: idConcesionario}}, {new: true, fields: {Contrasena: 0}});
        //Si la modificación retorna un documento vacío es porque el cliente no existe
        if(!userModified || userModified.length === 0)
            return res.json({success: false, message: "El cliente seleccionado no existe", model: null});
        //Todo correcto, retornamos el cliente modificado al front-end
        return res.json({success: true, message: "Concesionario agregado exitosamente", model: userModified});
    //Capturamos cualquier error durante la búsqueda y modificación del cliente
    }catch(err){
        return res.json({success: false, message: err, model: null});
    }
};

//======================Eliminar (desactivar) a un usuario (cliente)======================
exports.updateStatusCliente = function(req, res){
    //Si el parámetro del ID del cliente o el query para activar o desactivar el usuario vienen vacíos responder con error
    if(!req.params.id || !req.query.act)
        return res.json({success: false, message: "No ha sido seleccionado el cliente o si quiere activar o desactivar su estatus", model: null});
    //Convertimos en ObjectID el parámetro correspondiente al ID del cliente    
    let idCliente = new ObjectId(req.params.id);
    //Si el query es 1 queremos activar el cliente, si es 0 lo queremos desactivar
    let estatus = (req.query.act == 1) ? {Estatus: true} : {Estatus: false};
    let actOrDesact = (req.query.act == 1) ? "activado" : "desactivado";
    //Buscamos el cliente de acuerdo a su ID y modificamos su estatus, retornando el documento modificado sin contraseña
    userModel.findOneAndUpdate({_id: idCliente}, estatus, {new: true, fields: {Contrasena: 0}}).then(doc => {
        //Si el documento modificado está vacío es porque el cliente no existe
        if(!doc || doc.length === 0)
            return res.json({success: false, message: "El cliente seleccionado no existe", model: null});
        //Todo correcto, retornamos el cliente modificado al front-end
        return res.json({success: true, message: `Usuario ${actOrDesact} exitosamente`, model: doc});
    //Capturamos cualquier error que suceda durante la búsqueda o la modificación del cliente
    }).catch(err => {
        return res.json({success: false, message: err.message, model: null});
    });
 }