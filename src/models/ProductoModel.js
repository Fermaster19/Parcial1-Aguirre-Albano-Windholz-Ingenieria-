const DatabaseSingleton = require('../config/DatabaseSingleton');
const Producto = require('./Producto');

class ProductoModel {
    constructor() {
        this.db = DatabaseSingleton.obtenerInstancia();
    }

    async obtenerTodos() {
        const filas = await this.db.consultar('SELECT * FROM productos');
        return filas.map((fila) => new Producto(fila));
    }

    async obtenerPorId(id) {
        const filas = await this.db.consultar(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );
        return filas.length ? new Producto(filas[0]) : null;
    }

    async crear(datos) {
        await this.db.consultar(
            'INSERT INTO productos(nombre, precio, stock, marca) VALUES (?, ?, ?, ?)',
            [datos.nombre, datos.precio, datos.stock, datos.marca]
        );
    }

    async actualizar(id, datos) {
        await this.db.consultar(
            'UPDATE productos SET nombre=?, precio=?, stock=?, marca=? WHERE id=?',
            [datos.nombre, datos.precio, datos.stock, datos.marca, id]
        );
    }

    async eliminar(id) {
        await this.db.consultar('DELETE FROM productos WHERE id=?', [id]);
    }
}

module.exports = ProductoModel;
