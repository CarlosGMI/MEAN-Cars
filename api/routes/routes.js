let express = require('express');
let passport = require('passport');
let homeController = require('../controllers/homeController');
let profileController = require('../controllers/profileController');
let authController = require('../controllers/Administracion/authController');
let userController = require('../controllers/Administracion/userController');
let concesionarioController = require('../controllers/Administracion/concesionarioController');
let router = express.Router();
require('../config/passport');
let requireUser = passport.authenticate('user', {session: false, failureRedirect: '/requireAuth'});
let requireAdmin = passport.authenticate('admin', {session: false, failureRedirect: '/unauthorized'});

//#region ===============Rutas para la página principal===============
router.get('/', homeController.index);
//#endregion

//#region ===============Rutas para el perfil del usuario===============
router.get('/profile', requireUser, profileController.profile); //Ver el perfil del usuario
router.put('/profile', requireUser, profileController.updateProfile); //Modificar información básica del usuario
//#endregion

//#region ===============Rutas para la autenticación de los usuarios===============
router.post('/register', authController.register); //Registro de usuarios
router.post('/login', authController.login); //Inicio de sesión de usuarios
router.get('/requireAuth', authController.requireAuth); //Requiere autenticación para poder ingresar
router.get('/unauthorized', authController.unauthorized); //Requiere autorización para poder ingresar
//#endregion

//#region ===============RUTAS DE ADMINISTRACIÓN===============
//#region ===============Rutas para la administración de concesionarios===============
router.get('/concesionarios', requireAdmin, concesionarioController.getConcesionarios); //Obtener todos los concesionarios
router.get('/concesionarios/search', requireAdmin, concesionarioController.searchConcesionarioPorNombre); //Buscar concesionarios por nombre
router.delete('/concesionarios/:id', requireAdmin, concesionarioController.deleteConcesionario); //Eliminar un concesionario
router.put('/updateConcesionarios/:id', requireAdmin, concesionarioController.updateConcesionario); //Modificar un concesionario
router.post('/concesionarios', requireAdmin, concesionarioController.createConcesionario); //Registrar un concesionario
//#endregion

//#region ===============Rutas para la administración de usuarios===============
router.get('/clientes', requireAdmin, userController.getClientes); //Obtener todos los clientes registrados (ordenados por nombres y apellidos) y poder filtrarlos por estado
router.get('/clientes/search', requireAdmin, userController.searchCliente); //Buscar un usuario por cédula o correo
router.put('/clientes/roles/:id', requireAdmin, userController.updateCliente); //Modificar roles de un usuario
router.put('/clientes/:id', requireAdmin, userController.updateStatusCliente); //Desactivar un usuario
router.put('/clientes/concesionario/:idCliente&:idConcesionario', requireAdmin, userController.deleteConcesionario); //Eliminar un concesionario de un usuario
router.post('/clientes/addConcesionario/:id', requireAdmin, userController.addConcesionario); //Agregar un concesionario a un usuario
//#endregion
//#endregion

module.exports = router;