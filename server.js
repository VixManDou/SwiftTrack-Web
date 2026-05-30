const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del Motor de Plantillas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SIMULACIÓN DE PATRÓN MIDDLEWARE (Seguridad de Roles - RBAC)
const verificarRolAdmin = (req, res, next) => {
    const { rol } = req.query; // Simulación por URL: ?rol=admin
    if (rol === 'admin') {
        next(); // Permite pasar al controlador
    } else {
        res.status(403).render('error', { 
            mensaje: 'ACCESO RECHAZADO: Usuario sin permisos suficientes (RBAC Aplicado).' 
        });
    }
};

// Base de datos simulada en memoria
const paquetes = [
    { folio: 'ST-98231', destino: 'Aguascalientes', estado: 'En Ruta', peso: 2.5 },
    { folio: 'ST-44120', destino: 'Ciudad de México', estado: 'Entregado', peso: 1.2 }
];

// RUTAS
app.get('/', (req, res) => {
    res.render('index', { paquetes });
});

// Buscador público de rastreo
app.get('/rastreo', (req, res) => {
    const { folio } = req.query;
    const paquete = paquetes.find(p => p.folio === folio);
    res.render('rastreo', { paquete, query: folio });
});

// Ruta de administración protegida (Simula la seguridad requerida)
app.post('/admin/actualizar', verificarRolAdmin, (req, res) => {
    const { folio, nuevoEstado } = req.body;
    const paquete = paquetes.find(p => p.folio === folio);
    if (paquete) {
        paquete.estado = nuevoEstado;
        res.redirect('/?rol=admin');
    } else {
        res.status(404).send('Paquete no encontrado');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor SwiftTrack corriendo en http://localhost:${PORT}`);
});