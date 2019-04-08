let userModel = require('../models/userModel');
let ObjectId = require('mongodb').ObjectId

//======================Obtener todos los datos básicos del usuario y mostrarlos en su perfil======================
exports.profile = async function(req, res){
    //Convertimos a ObjectID el ID del usuario que se obtiene del req.user que almacena Passport cuando haces login
    let idUser = new ObjectId(req.user.id);
    try{
        //Obtenemos los datos básicos del usuario logeado, llenando la información con respecto a sus concesionarios asociados
        let userInfo = await userModel.findOne({_id: idUser}, {Contrasena: 0, Roles: 0, Estatus: 0, CreatedOn: 0})
        .populate('Concesionarios', 'Nombre Region', null, {sort: {'Region': 1, 'Nombre': 1}});
        //Si los datos básicos del usuario vienen vacíos es porque el usuario no existe PERO ESTO NO DEBERÍA PASAR
        if(!userInfo || userInfo.length === 0)
            return res.json({success: false, message: "Ocurrió un error encontrando tus datos", model: null});
        //Todo correcto, retornamos los datos básicos del usuario al front-end
        return res.json({success: true, message: "", model: userInfo});
    //Capturamos cualquier error durante la búsqueda del usuario y del llenado de sus concesionarios
    }catch(err){
        return res.json({success: false, message: err.message, model: null});
    }
}

//======================Actualizar los datos básicos del usuario en su perfil======================
exports.updateProfile = async function(req, res){
    //Convertimos a ObjectID el ID del usuario que se obtiene del req.user que almacena Passport cuando haces login
    let idUser = new ObjectId(req.user.id);
    try{
        //Obtenemos el usuario logeado y actualizamos lo que sea que haya actualizado y llenamos sus concesionarios asociados
        let userModified = await userModel.findOneAndUpdate({_id: idUser}, req.body, {runValidators: true, new: true, fields: {Contrasena: 0, Roles: 0, Estatus: 0, CreatedOn: 0}})
        .populate('Concesionarios', 'Nombre Region', null, {sort: {'Region': 1, 'Nombre': 1}});
        //Si el documento modificado retorna vacío es porque el usuario no existe PERO ESTO NO DEBERÍA PASAR
        if(!userModified || userModified.length === 0)
            return res.json({success: false, message: "Ocurrió un error al actualizar tus datos", model: null});
        //Todo correcto, retornamos los datos básicos del usuario al front-end, incluyendo lo que acaba de modificar
        return res.json({success: true, message: "Datos actualizados exitosamente", model: userModified});
    //Capturamos cualquier error durante la modificación de los datos del usuario y del llenado de sus concesionarios
    }catch(err){
        return res.json({success: false, message: err.message, model: null});
    }
};