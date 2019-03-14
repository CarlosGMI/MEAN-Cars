const express = require('express');
let homeController = require('../controllers/homeController');
let concesionarioController = require('../controllers/Administracion/concesionarioController');
let router = express.Router();

//#region Rutas para la página principal
router.get('/', homeController.index);
//#endregion

//#region Rutas para la administración de concesionarios
router.get('/concesionarios', concesionarioController.getConcesionarios);
router.post('/addConcesionario', concesionarioController.createConcesionario);
//#endregion

module.exports = router;