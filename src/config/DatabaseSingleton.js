const mysql = require('mysql2');

/**
 * Patrón Singleton: una única instancia de conexión a MySQL en toda la aplicación.
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
