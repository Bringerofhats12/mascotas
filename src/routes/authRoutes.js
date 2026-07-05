const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.get('/login', controller.formLogin);       // Formulario de login
router.post('/login', controller.login);          // Procesar login
router.get('/registro', controller.formRegistro);  // Formulario de registro
router.post('/registro', controller.registro);     // Procesar registro
router.post('/logout', controller.logout);         // Cerrar sesión

module.exports = router;
