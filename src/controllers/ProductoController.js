const ProductoService = require('../services/ProductoService');
const ValidationError = require('../errors/ValidationError');

class ProductoController {
    constructor(servicio = new ProductoService()) {
        this.servicio = servicio;
    }

    _parsearId(idParam) {
        const id = Number(idParam);
        if (!Number.isInteger(id) || id <= 0) {
            return null;
        }
        return id;
    }

    _responderError(res, error, mensajeError) {
        if (error instanceof ValidationError) {
            return res.status(400).json({ mensaje: error.message });
        }
        return res.status(500).json({ mensaje: mensajeError, error: error.message });
    }

    async listar(req, res) {
        try {
            const estrategia = req.query.estrategia || 'lista';
            const respuesta = await this.servicio.listarConPresentacion(estrategia);
            res.json(respuesta);
        } catch (error) {
            this._responderError(res, error, 'Error al listar productos');
        }
    }

    async obtenerPorId(req, res) {
        const id = this._parsearId(req.params.id);

        if (!id) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        try {
            const estrategia = req.query.estrategia || 'lista';
            const producto = await this.servicio.obtenerPorIdConPresentacion(id, estrategia);

            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            res.json(producto);
        } catch (error) {
            this._responderError(res, error, 'Error al buscar producto');
        }
    }

    async crear(req, res) {
        try {
            await this.servicio.crear(req.body);
            res.status(201).json({ mensaje: 'Producto creado' });
        } catch (error) {
            this._responderError(res, error, 'Error al crear producto');
        }
    }

    async actualizar(req, res) {
        const id = this._parsearId(req.params.id);
        if (!id) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        try {
            await this.servicio.actualizar(id, req.body);
            res.json({ mensaje: 'Producto actualizado' });
        } catch (error) {
            this._responderError(res, error, 'Error al actualizar producto');
        }
    }

    async eliminar(req, res) {
        const id = this._parsearId(req.params.id);
        if (!id) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        try {
            await this.servicio.eliminar(id);
            res.json({ mensaje: 'Producto eliminado' });
        } catch (error) {
            this._responderError(res, error, 'Error al eliminar producto');
        }
    }
}

module.exports = ProductoController;
