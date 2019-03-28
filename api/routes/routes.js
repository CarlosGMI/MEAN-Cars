let express = require('express');
let passport = require('passport');
let homeController = require('../controllers/homeController');
let authController = require('../controllers/Administracion/authController');
let concesionarioController = require('../controllers/Administracion/concesionarioController');
let router = express.Router();
let util = require('util');
require('../config/passport');
let requireUser = passport.authenticate('user', {session: false, failureRedirect: '/requireAuth'});
let requireAdmin = passport.authenticate('admin', {session: false, failureRedirect: '/unauthorized'});
let requireLogin = passport.authenticate('local', {session: false, successRedirect: '/autenticado', failureRedirect: '/noAutenticado'});


//#region Rutas para la página principal
router.get('/', homeController.index);
//#endregion

//#region Rutas para la administración de concesionarios
router.get('/concesionarios', concesionarioController.getConcesionarios); //Obtener todos los concesionarios
router.get('/concesionarios/search', concesionarioController.searchConcesionarioPorNombre); //Buscar concesionarios por nombre
router.delete('/concesionarios/:id', concesionarioController.deleteConcesionario); //Eliminar un concesionario
router.put('/updateConcesionarios/:id', concesionarioController.updateConcesionario); //Modificar un concesionario
router.post('/concesionarios', concesionarioController.createConcesionario); //Registrar un concesionario
//#endregion

//#region Rutas para la autenticación de los usuarios
router.post('/register', authController.register); //Registro de usuarios
router.post('/login', authController.login); //Inicio de sesión de usuarios
router.get('/pruebaUser', requireUser, authController.pruebaUser);
router.get('/pruebaAdmin', requireAdmin, authController.pruebaAdmin);
router.get('/requireAuth', authController.requireAuth);
router.get('/unauthorized', authController.unauthorized);
//#endregion

module.exports = router;