# Parcial - Gestión de Inventario (MVP)

 Integrantes: Aguirre Claudio 
              Albano Julieta 
              Windholz Cristhian 

Aplicación CRUD de inventario de productos que cumple **arquitectura MVC** y tres **patrones de diseño**: Singleton, Decorator y Strategy.

## Stack

- Backend: Node.js + Express (MVC)
- Base de datos: MySQL
- Frontend: HTML + CSS + JavaScript vanilla (MVC)

## Arquitectura MVC

### Backend (`src/`)

| Capa | Responsabilidad | Archivos |
|------|-----------------|----------|
| **Entidad** | Objeto de dominio (datos del producto) | `models/Producto.js` |
| **Modelo** | Solo persistencia CRUD (SQL) | `models/ProductoModel.js` |
| **Servicio** | Lógica de negocio; usa Strategy y Decorator | `services/ProductoService.js` |
| **Vista** | No aplica en API REST (la respuesta JSON es la salida) | — |
| **Controlador** | Solo HTTP: validación de request, status y JSON | `controllers/ProductoController.js` |
| **Rutas** | Enrutamiento Express | `routes/productoRoutes.js` |

`Producto` es la entidad; `ProductoModel` accede a MySQL; `ProductoService` aplica el cálculo de precio (Strategy) y el armado de la descripción (Decorator) antes de devolver datos al controlador.

### Frontend (`public/js/`)

| Capa | Responsabilidad | Archivos |
|------|-----------------|----------|
| **Modelo** | Comunicación con la API | `models/ProductoApiModel.js` |
| **Vista** | Renderizado del DOM | `views/ProductoView.js` |
| **Controlador** | Eventos y coordinación | `controllers/ProductoUIController.js` |

## Patrones de diseño

### 1. Singleton (`src/config/DatabaseSingleton.js`)

Garantiza **una única conexión** a MySQL en toda la aplicación.

```js
const db = DatabaseSingleton.obtenerInstancia();
```

### 2. Decorator (`src/patterns/decorator/ProductoDecorator.js`)

Añade dinámicamente etiquetas a la descripción del producto:

- **Stock bajo** si `stock < 5`
- **Marca premium** si la marca es Samsung, Apple, Sony o LG

### 3. Strategy (`src/patterns/strategy/PrecioStrategy.js`)

Intercambia el algoritmo de cálculo de precio en tiempo de ejecución:

| Estrategia | Regla |
|------------|-------|
| `lista` | Precio original |
| `mayorista` | 15% de descuento |
| `promocion` | 25% de descuento si stock ≥ 10 |

Se selecciona desde el frontend o con query: `GET /productos?estrategia=mayorista`

## Estructura del proyecto

```
Parcial-1/
├── server.js                 # Punto de entrada
├── src/
│   ├── config/
│   │   └── DatabaseSingleton.js
│   ├── models/
│   ├── services/
│   ├── controllers/
│   ├── routes/
│   └── patterns/
│       ├── decorator/
│       └── strategy/
└── public/
    ├── index.html
    ├── style.css
    └── js/
        ├── models/
        ├── views/
        ├── controllers/
        └── app.js
```

## Requisitos

- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) (MySQL)

## Instalación

```bash
npm install
```

## Base de datos

En phpMyAdmin:

```sql
CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  marca VARCHAR(100) NOT NULL
);
```

Configuración MySQL en `src/config/DatabaseSingleton.js` (host, user, password, database).

## Ejecución

```bash
npm start
```

Abrir en el navegador: **http://localhost:3000**

El servidor sirve el frontend y la API en el mismo puerto.

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos?estrategia=lista` | Listar con precio calculado y descripción decorada |
| GET | `/productos/:id?estrategia=promocion` | Buscar por ID |
| POST | `/productos` | Crear |
| PUT | `/productos/:id` | Actualizar |
| DELETE | `/productos/:id` | Eliminar |
