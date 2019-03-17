const express = require('express');
let homeController = require('../controllers/homeController');
let concesionarioController = require('../controllers/Administracion/concesionarioController');
let router = express.Router();

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

module.exports = router;