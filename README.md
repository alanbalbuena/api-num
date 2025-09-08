# API REST con Node.js

Esta es una API REST construida con Node.js y Express.

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clona este repositorio
2. Instala las dependencias:
```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=databaseNum
JWT_SECRET=tu-secret-key-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=24h
```

### Configuración de la Base de Datos

1. Ejecuta las migraciones en orden:
```sql
-- Ejecutar en tu base de datos MySQL
source src/migrations/001_create_operaciones.sql
source src/migrations/002_create_clientes.sql
source src/migrations/003_create_brokers.sql
source src/migrations/004_create_empresas.sql
source src/migrations/005_create_usuarios.sql
source src/migrations/006_create_esquemas.sql
source src/migrations/007_add_password_to_usuarios.sql
```

### Autenticación JWT

La API ahora incluye autenticación JWT. Para usar las rutas protegidas:

1. **Login**: `POST /api/auth/login`
```json
{
  "correo": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

2. **Usar el token**: Incluir en el header `Authorization: Bearer <token>`

3. **Rutas protegidas**: Todas las rutas excepto `/api/auth/login` requieren autenticación

## Scripts disponibles

- `npm start`: Inicia el servidor en modo producción
- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon
- `npm test`: Ejecuta las pruebas (pendiente de implementar)

## Estructura del proyecto

```
api-num/
├── src/
│   ├── controllers/    # Controladores de la API
│   ├── routes/         # Rutas de la API
│   ├── models/         # Modelos de datos
│   ├── middleware/     # Middleware personalizado
│   └── index.js        # Punto de entrada de la aplicación
├── .env.example        # Template para variables de entorno
├── package.json        # Dependencias y scripts
└── README.md          # Documentación
``` 