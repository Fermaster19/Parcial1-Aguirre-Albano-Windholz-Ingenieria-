const ProductoModel = require('../models/ProductoModel');
const ValidationError = require('../errors/ValidationError');
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

    /**
     * Valida y normaliza datos de entrada para crear/actualizar productos.
     * @throws {ValidationError}
     */
    validarDatos(datos) {
        const { nombre, precio, stock, marca } = datos ?? {};

        if (nombre === undefined || nombre === null || String(nombre).trim() === '') {
            throw new ValidationError('El nombre es obligatorio');
        }

        if (marca === undefined || marca === null || String(marca).trim() === '') {
            throw new ValidationError('La marca es obligatoria');
        }

        const precioNum = Number(precio);
        if (precio === undefined || precio === null || Number.isNaN(precioNum) || precioNum < 0) {
            throw new ValidationError('El precio debe ser un número mayor o igual a 0');
        }

        const stockNum = Number(stock);
        if (
            stock === undefined ||
            stock === null ||
            Number.isNaN(stockNum) ||
            !Number.isInteger(stockNum) ||
            stockNum < 0
        ) {
            throw new ValidationError('El stock debe ser un entero mayor o igual a 0');
        }

        return {
            nombre: String(nombre).trim(),
            marca: String(marca).trim(),
            precio: precioNum,
            stock: stockNum
        };
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
        const datosValidos = this.validarDatos(datos);
        return this.modelo.crear(datosValidos);
    }

    async actualizar(id, datos) {
        const datosValidos = this.validarDatos(datos);
        return this.modelo.actualizar(id, datosValidos);
    }

    async eliminar(id) {
        return this.modelo.eliminar(id);
    }
}

module.exports = ProductoService;
