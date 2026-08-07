const express = require('express');
const router = express.Router();

const paqueteController = require('../controllers/paqueteController');
const security = require('../middlewares/security');

// Rutas públicas
router.get('/', paqueteController.obtenerHome);
router.post('/rastreo', paqueteController.rastrearPaquete);
router.get('/admin/login', paqueteController.mostrarLoginAdmin);
router.post('/admin/login', paqueteController.loginAdmin);
router.get('/api/v1/paquetes/:folio', paqueteController.apiObtenerPaquetePorFolio);

// Rutas administrativas protegidas
router.get('/admin/dashboard', security, paqueteController.mostrarDashboardAdmin);
router.post('/admin/crear', security, paqueteController.crearPaquete);
router.post('/admin/actualizar', security, paqueteController.actualizarEstado);
router.post('/admin/eliminar', security, paqueteController.eliminarPaquete);

module.exports = router;
