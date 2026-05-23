/**
 * Modelo (frontend): acceso a datos vía API REST.
 */
class ProductoApiModel {
    constructor(baseUrl = 'http://localhost:3000/productos') {
        this.baseUrl = baseUrl;
    }

    async obtenerTodos(estrategia = 'lista') {
        const respuesta = await fetch(`${this.baseUrl}?estrategia=${estrategia}`);
        return respuesta.json();
    }

    async obtenerPorId(id, estrategia = 'lista') {
        const respuesta = await fetch(`${this.baseUrl}/${id}?estrategia=${estrategia}`);
        return { respuesta, datos: await respuesta.json() };
    }

    async crear(producto) {
        await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
    }

    async actualizar(id, producto) {
        await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
    }

    async eliminar(id) {
        await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
    }
}
