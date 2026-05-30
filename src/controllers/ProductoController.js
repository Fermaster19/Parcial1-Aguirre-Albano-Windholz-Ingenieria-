const ProductoService = require('../services/ProductoService');

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

    _validarDatosProducto(body) {
        const { nombre, precio, stock, marca } = body ?? {};

        if (nombre === undefined || nombre === null || String(nombre).trim() === '') {
            return { error: 'El nombre es obligatorio' };
        }

        if (marca === undefined || marca === null || String(marca).trim() === '') {
            return { error: 'La marca es obligatoria' };
        }

        const precioNum = Number(precio);
        if (precio === undefined || precio === null || Number.isNaN(precioNum) || precioNum < 0) {
            return { error: 'El precio debe ser un número mayor o igual a 0' };
        }

        const stockNum = Number(stock);
        if (
            stock === undefined ||
            stock === null ||
            Number.isNaN(stockNum) ||
            !Number.isInteger(stockNum) ||
            stockNum < 0
        ) {
            return { error: 'El stock debe ser un entero mayor o igual a 0' };
        }

        return {
            datos: {
                nombre: String(nombre).trim(),
                marca: String(marca).trim(),
                precio: precioNum,
                stock: stockNum
            }
        };
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
            res.status(500).json({ mensaje: 'Error al buscar producto', error: error.message });
        }
    }

    async crear(req, res) {
        const validacion = this._validarDatosProducto(req.body);
        if (validacion.error) {
            return res.status(400).json({ mensaje: validacion.error });
        }

        try {
            await this.servicio.crear(validacion.datos);
            res.json({ mensaje: 'Producto creado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
        }
    }

    async actualizar(req, res) {
        const id = this._parsearId(req.params.id);
        if (!id) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        const validacion = this._validarDatosProducto(req.body);
        if (validacion.error) {
            return res.status(400).json({ mensaje: validacion.error });
        }

        try {
            await this.servicio.actualizar(id, validacion.datos);
            res.json({ mensaje: 'Producto actualizado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
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
            res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
        }
    }
}

module.exports = ProductoController;
