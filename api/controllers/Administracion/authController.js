const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
let app = express();
let {secret} = require('../../config/jwtConfig');
let userModel = require('../../models/userModel');

//======================Registrar un usuario======================
exports.register = function(req, res){
    //Si el body del POST request viene vacío responde con error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0)
        return res.json({success: false, message: "Por favor, llene el formulario"});
    //Creamos el usuario que se añadirá en la base de datos
    let user = new userModel(req.body);
    //Guardamos el usuario en la base de datos
    user.save().then(doc => {
        //Si el documento que retorna el guardado es null o viene vacío responde con error
        if(!doc || doc.length === 0)
            return res.json({success: false, message: "Ha ocurrido un error al registrar el usuario", model: user});
        //Todo correcto, registro exitoso
        return res.json({success: true, message: "El usuario ha sido registrado exitosamente", model: null});
    //Capturamos cualquier error durante el guardado del usuario en base de datos
    }).catch(err => {
        //Si el error es de duplicación de datos responde con error. Si no, añade cualquier error a un array de mensajes de error.
        if(err.code === 11000)
            return res.json({success: false, message: "Este usuario ya ha sido registrado anteriormente", model: user});
        let errors = [];
        for(let errName in err.errors){
            errors.push({name: errName, message: err.errors[errName].message});
        }
        return res.json({success: false, message: errors, model: user});
    });
};

//======================Inicio de sesión de un usuario======================
exports.login = app.use(function(req, res, next){
    //Nos autenticamos usando la estrategia local de Passport
    passport.authenticate('local', {session: false}, (error, user) => {
        //Si hay un error en el inicio de sesión es porque el usuario no existe o por algún otro error
        if(error || !user)
            return res.json({success: false, message: error, model: req.body});
        //Inicio de sesión correcto, creamos el contenido que tendrá el JWT token: el email, los roles y la fecha de expiración
        let payload = {
            email: user.Email,
            roles: user.Roles,
            expires: new Date(Date.now() + 900000),
        };
        //Asignamos ese payload o contenido al request
        req.login(payload, {session: false}, (error) => {
            //Respondemos en caso de existir algún error asignando el payload
            if(error)
                return res.json({success: false, message: "Ha ocurrido un error durante el inicio de sesión", model: user});
            //Creamos el JWT colocando como contenido el payload y firmándolo con nuestro secreto
            let token = jwt.sign(JSON.stringify(payload), secret);
            //Guardamos el JWT token en una cookie y el inicio de sesión ha sido exitoso
            res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: 900000 });
            return res.json({success: true, message: "Inicio de sesión exitoso", model: null});
        });
    })(req, res, next);
});

exports.pruebaUser = function(req, res){
    return res.json({message: "Hola, tengo permisos para entrar como Usuario"});
};

exports.pruebaAdmin = function(req, res){
    return res.json({message: "Hola, tengo permisos para entrar como Administrador"});
};

exports.requireAuth = function(req, res){
    return res.json({message: "Necesitas iniciar sesión para acceder a este sitio"});
};

exports.unauthorized = function(req, res){
    return res.json({message: "No posees la permisología adecuada para acceder a este sitio"});
};