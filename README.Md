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

**Separación de responsabilidades — Datos vs Lógica:** `Producto` es la entidad de dominio: solo almacena los campos del producto (`id`, `nombre`, `precio`, `stock`, `marca`) y expone `toJSON()` para serializarse; no tiene acceso a la base de datos ni reglas de negocio. `ProductoModel` es exclusivamente la capa de persistencia: ejecuta las consultas SQL sobre MySQL a través de `DatabaseSingleton` y convierte las filas en instancias de `Producto`, sin conocer nada de precios ni descripciones. Toda la lógica de negocio —el cálculo de precio según Strategy y el armado de la descripción mediante Decorator— reside únicamente en `ProductoService`, que orquesta modelo y patrones antes de devolver los datos listos al controlador.

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

**Trade-off: Conexión única vs Connection Pool**

Este MVP implementa Singleton con una **conexión única**:
- ✅ **Ventajas:** Simplicidad, bajo consumo de memoria, fácil de mantener
- ❌ **Limitaciones:** No es escalable; con muchos requests concurrentes, todos usan la misma conexión (cuello de botella)

**Para producción**, es recomendable usar **Connection Pool** (`mysql2.createPool()`):
- Múltiples conexiones reutilizables → mejor concurrencia
- Si una conexión falla, otras siguen disponibles → mayor resiliencia
- Costo: mayor consumo de memoria

**Decisión para este proyecto:** Singleton es suficiente y preferible por su simplicidad en un MVP.

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
└── __tests__/                # Pruebas unitarias con Jest
```

## Requisitos

- [Node.js](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/) (MySQL) — solo necesario para ejecutar la app completa con persistencia

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

## Pruebas

Ejecutar las pruebas unitarias con:

```bash
npm test
```

- Los tests son unitarios y no requieren que XAMPP o MySQL estén ejecutándose.
- Si se testea `src/models/ProductoModel.js`, debe mockearse `src/config/DatabaseSingleton.js` para evitar ejecutar SQL directo en las pruebas.

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/productos?estrategia=lista` | Listar con precio calculado y descripción decorada |
| GET | `/productos/:id?estrategia=promocion` | Buscar por ID |
| POST | `/productos` | Crear |
| PUT | `/productos/:id` | Actualizar |
| DELETE | `/productos/:id` | Eliminar |
