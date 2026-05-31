/**
 * Modelo (frontend): acceso a datos vía API REST.
 */
class ProductoApiModel {
    constructor(baseUrl = 'http://localhost:3000/productos') {
        this.baseUrl = baseUrl;
    }

    async _procesarRespuesta(respuesta) {
        const datos = await respuesta.json().catch(() => ({}));
        if (!respuesta.ok) {
            const error = new Error(datos.mensaje || 'Error en la petición');
            error.status = respuesta.status;
            throw error;
        }
        return datos;
    }

    async obtenerTodos(estrategia = 'lista') {
        const respuesta = await fetch(`${this.baseUrl}?estrategia=${estrategia}`);
        return this._procesarRespuesta(respuesta);
    }

    async obtenerPorId(id, estrategia = 'lista') {
        const respuesta = await fetch(`${this.baseUrl}/${id}?estrategia=${estrategia}`);
        const datos = await respuesta.json().catch(() => ({}));
        return { respuesta, datos };
    }

    async crear(producto) {
        const respuesta = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
        return this._procesarRespuesta(respuesta);
    }

    async actualizar(id, producto) {
        const respuesta = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
        return this._procesarRespuesta(respuesta);
    }

    async eliminar(id) {
        const respuesta = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
        return this._procesarRespuesta(respuesta);
    }
}
