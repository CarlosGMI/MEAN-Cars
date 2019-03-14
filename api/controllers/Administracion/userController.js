/* let userModel = require('../../models/userModel');

//Creación de un usuario
exports.createUser = function (req, res) {
    //Si el body del POST request viene vacío responde con error
    if (!req.body)
        return res.json({ error: "El formulario se encuentra vacío" });
    let user = new userModel(req.body); //Creamos el usuario que se añadirá en base de datos
    user.save();
}; */