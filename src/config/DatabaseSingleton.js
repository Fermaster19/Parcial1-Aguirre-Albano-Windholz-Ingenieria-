const mysql = require('mysql2');

/**
 * Patrón Singleton: una única instancia de conexión a MySQL en toda la aplicación.
 * 
 * TRADE-OFF: Conexión única vs Connection Pool
 * =============================================
 * 
 * VENTAJAS de esta implementación (Singleton con conexión única):
 * - Simplicidad: fácil de entender, implementar y mantener
 * - Bajo consumo de memoria: solo una conexión activa
 * - Adecuado para MVP (Minimum Viable Product) y aplicaciones pequeñas
 * - Garantiza reutilización de la conexión
 * 
 * DESVENTAJAS y limitaciones:
 * - NO escalable: no es adecuado para aplicaciones en producción con alto tráfico
 * - Cuello de botella: si hay múltiples requests concurrentes, todos comparten la misma conexión
 * - Si una query tarda mucho, las demás deben esperar (problema de sincronización)
 * - Punto único de fallo: si la conexión se pierde, toda la aplicación deja de funcionar
 * 
 * ALTERNATIVA recomendada para producción: Connection Pool
 * - mysql2.createPool() mantiene múltiples conexiones reutilizables
 * - Mayor concurrencia: cada request puede usar una conexión diferente
 * - Mejor manejo de fallos: si una conexión falla, otras siguen disponibles
 * - Requiere más recursos de memoria
 * 
 * Para este MVP: La implementación Singleton es suficiente y preferible por su simplicidad.
 */
class DatabaseSingleton {
    static #instancia = null;

    constructor() {
        if (DatabaseSingleton.#instancia) {
            return DatabaseSingleton.#instancia;
        }

        this.conexion = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'tienda'
        });

        this.conexion.connect((err) => {
            if (err) {
                console.log('Error de conexión:', err);
            } else {
                console.log('MySQL conectado');
            }
        });

        DatabaseSingleton.#instancia = this;
    }

    static obtenerInstancia() {
        if (!DatabaseSingleton.#instancia) {
            DatabaseSingleton.#instancia = new DatabaseSingleton();
        }
        return DatabaseSingleton.#instancia;
    }

    consultar(sql, parametros = []) {
        return new Promise((resolve, reject) => {
            this.conexion.query(sql, parametros, (err, resultados) => {
                if (err) reject(err);
                else resolve(resultados);
            });
        });
    }
}

module.exports = DatabaseSingleton;
