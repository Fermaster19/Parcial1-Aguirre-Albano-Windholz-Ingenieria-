const ProductoModel = require('../models/ProductoModel');
const { PrecioContexto } = require('../patterns/strategy/PrecioStrategy');
const { decorarProducto } = require('../patterns/decorator/ProductoDecorator');

/**
 * Capa de dominio: orquesta persistencia, Strategy (precio) y Decorator (descripción).
 */
class ProductoService {
    constructor(modelo = new ProductoModel()) {
        this.modelo = modelo;
        this.precioContexto = new PrecioContexto();
    }

    enriquecerProducto(producto, tipoEstrategia = 'lista') {
        this.precioContexto.establecerEstrategia(tipoEstrategia);
        const decorado = decorarProducto(producto);

        return {
            ...producto.toJSON(),
            precioCalculado: this.precioContexto.calcularPrecio(producto),
            estrategia: this.precioContexto.getTipoActual(),
            descripcion: decorado.obtenerDescripcion()
        };
    }

    async listarConPresentacion(tipoEstrategia = 'lista') {
        const productos = await this.modelo.obtenerTodos();
        return productos.map((producto) =>
            this.enriquecerProducto(producto, tipoEstrategia)
        );
    }

    async obtenerPorIdConPresentacion(id, tipoEstrategia = 'lista') {
        const producto = await this.modelo.obtenerPorId(id);
        if (!producto) {
            return null;
        }
        return this.enriquecerProducto(producto, tipoEstrategia);
    }

    async crear(datos) {
        return this.modelo.crear(datos);
    }

    async actualizar(id, datos) {
        return this.modelo.actualizar(id, datos);
    }

    async eliminar(id) {
        return this.modelo.eliminar(id);
    }
}

module.exports = ProductoService;
