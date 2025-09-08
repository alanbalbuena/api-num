const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const clienteRoutes = require('./routes/cliente.routes');
const vacacionesRoutes = require('./routes/vacaciones.routes');
const operacionRoutes = require('./routes/operacion.routes');
const empresaRoutes = require('./routes/empresa.routes');
const brokerRoutes = require('./routes/broker.routes');

// Inicialización
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API',
    status: 'online'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes); // Primero las rutas de auth (públicas)
app.use('/api', apiRoutes); // Luego las rutas generales de API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/operaciones', operacionRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/brokers', brokerRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'La ruta solicitada no existe'
  });
});

// Manejo de errores general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Algo salió mal en el servidor'
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 