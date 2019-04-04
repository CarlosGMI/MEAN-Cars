const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const {secret} = require('./jwtConfig');
const userModel = require('../models/userModel');
let util = require('util');

//Configurar la estrategia local para la autenticación del usuario
passport.use(new localStrategy({
    //Obtenemos los campos del req.body (en este caso el email y la contraseña)
    usernameField: 'Email',
    passwordField: 'Contrasena',
}, async (email, contrasena, done) => {
    try{
        //Buscamos al usuario en la base de datos de acuerdo a su email
        let user = await userModel.findOne({Email: email}).exec();
        //Si el usuario no existe es porque el email no se encuentra registrado en la base de datos
        if(!user)
            return done('El email no se encuentra registrado en el sistema');
        //Si la contraseña no coincide con el hash almacenado en base de datos es porque la contraseña es incorrecta
        if(!await user.comparePassword(contrasena))
            return done('Contraseña incorrecta');
        //Todo correcto, usuario encontrado en base de datos y su contraseña coincide con el hash almacenado
        done(null, user);
    //Capturamos cualquier error que suceda durante la búsqueda del usuario y en la comparación de contraseñas
    } catch(error){ //Puede ser que haya que manejar las excepciones de usuario no encontrado acá en el catch
        return done(error, "Ha ocurrido un error durante la autenticación");
    }
}));

//Configurar la estrategia mediante el JWT token para verificar la permisología del rol "Administrador"
passport.use('admin', new jwtStrategy({
    //Obtenemos el token de la cookie que está en el header del request y la validamos con el secret
    jwtFromRequest: req => req.cookies['jwt'] || null,
    secretOrKey: secret,
}, (jwtPayload, done) => {
        //Si el token contiene una fecha de expiración inferior a la actual ya se venció. El usuario debe autenticarse nuevamente
        if(Date.now() > jwtPayload.expires)
            return done(null, false, {message: "El JWT token ha expirado"});
        //Si el token no contiene el rol de administrador entonces al usuario se le niega permisologías
        if(!jwtPayload.roles.includes("Administrador"))
            return done(null, false, {message: 'No posees permisologías adecuadas para acceder a esta página'});
        //Todo correcto, usuario con permisología adecuada y token en regla
        return done(null, jwtPayload);
    }
));

//Configurar la estrategia mediante el JWT token para verificar las permisologías de usuarios comunes (rol "Usuario")
passport.use('user', new jwtStrategy({
    //Obtenemos el token de la cookie que está en el header del request y la validamos con el secret
    jwtFromRequest: req => req.cookies['jwt'] || null,
    secretOrKey: secret,
}, (jwtPayload, done) => {
        //Si el token contiene una fecha de expiración inferior a la actual ya se venció. El usuario debe autenticarse nuevamente
        if(Date.now() > jwtPayload.expires)
            return done(null, false, {message: "El JWT token ha expirado"});
        //Todo correcto, usuario con permisología adecuada y token en regla
        return done(null, jwtPayload);
    }
));