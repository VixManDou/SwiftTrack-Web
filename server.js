const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env
dotenv.config();

const paqueteRoutes = require('./routes/paqueteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de vistas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Servir archivos estáticos (imágenes, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la aplicación
app.use('/', paqueteRoutes);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor SwiftTrack Web disponible en http://localhost:${PORT}`);
});
