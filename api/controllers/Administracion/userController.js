let userModel = require('../../models/userModel');
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
exports.deleteConcesionario = function(req, res){

};