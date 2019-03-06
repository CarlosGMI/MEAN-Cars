const express = require('express');
let homeController = require('../controllers/homeController');
let router = express.Router();

router.get('/', homeController.index);

module.exports = router;