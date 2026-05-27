const ProductoService = require('../services/ProductoService');

class ProductoController {
    constructor(servicio = new ProductoService()) {
        this.servicio = servicio;
    }

    async listar(req, res) {
        try {
            const estrategia = req.query.estrategia || 'lista';
            const respuesta = await this.servicio.listarConPresentacion(estrategia);
            res.json(respuesta);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al listar productos', error: error.message });
        }
    }

    async obtenerPorId(req, res) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
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
            res.status(500).json({ mensaje: 'Error al buscar producto', error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const { nombre, precio, stock, marca } = req.body;
            await this.servicio.crear({ nombre, precio, stock, marca });
            res.json({ mensaje: 'Producto creado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, precio, stock, marca } = req.body;
            await this.servicio.actualizar(id, { nombre, precio, stock, marca });
            res.json({ mensaje: 'Producto actualizado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            await this.servicio.eliminar(id);
            res.json({ mensaje: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
        }
    }
}

module.exports = ProductoController;
