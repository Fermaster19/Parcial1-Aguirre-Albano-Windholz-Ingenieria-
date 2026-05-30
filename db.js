/**
 * Compatibilidad: reexporta el Singleton de base de datos.
 * Configuración en src/config/DatabaseSingleton.js
 */
module.exports = require('./src/config/DatabaseSingleton').obtenerInstancia().conexion;
