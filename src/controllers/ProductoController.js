const ProductoModel = require('../models/ProductoModel');
const { PrecioContexto } = require('../patterns/strategy/PrecioStrategy');
const { decorarProducto } = require('../patterns/decorator/ProductoDecorator');

class ProductoController {
    constructor() {
        this.modelo = new ProductoModel();
        this.precioContexto = new PrecioContexto();
    }

    async listar(req, res) {
        try {
            const estrategia = req.query.estrategia || 'lista';
            this.precioContexto.establecerEstrategia(estrategia);

            const productos = await this.modelo.obtenerTodos();

            const respuesta = productos.map((producto) => {
                const decorado = decorarProducto(producto);
                const precioCalculado = this.precioContexto.calcularPrecio(producto);

                return {
                    ...producto.toJSON(),
                    precioCalculado,
                    estrategia: this.precioContexto.getTipoActual(),
                    descripcion: decorado.obtenerDescripcion()
                };
            });

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
            this.precioContexto.establecerEstrategia(estrategia);

            const producto = await this.modelo.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            const decorado = decorarProducto(producto);

            res.json({
                ...producto.toJSON(),
                precioCalculado: this.precioContexto.calcularPrecio(producto),
                estrategia: this.precioContexto.getTipoActual(),
                descripcion: decorado.obtenerDescripcion()
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al buscar producto', error: error.message });
        }
    }

    async crear(req, res) {
        try {
            const { nombre, precio, stock, marca } = req.body;
            await this.modelo.crear({ nombre, precio, stock, marca });
            res.json({ mensaje: 'Producto creado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, precio, stock, marca } = req.body;
            await this.modelo.actualizar(id, { nombre, precio, stock, marca });
            res.json({ mensaje: 'Producto actualizado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            await this.modelo.eliminar(id);
            res.json({ mensaje: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
        }
    }
}

module.exports = ProductoController;
