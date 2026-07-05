const express = require('express');
const router = express.Router();
const controller = require('../controllers/mascotaController');

router.get('/', controller.listar);              // Listar mascotas
router.get('/nuevo', controller.formCrear);       // Formulario de nueva mascota
router.post('/', controller.crear);               // Crear mascota
router.get('/:id/editar', controller.formEditar); // Formulario de edición
router.put('/:id', controller.editar);            // Actualizar mascota
router.delete('/:id', controller.eliminar);       // Eliminar mascota

module.exports = router;
