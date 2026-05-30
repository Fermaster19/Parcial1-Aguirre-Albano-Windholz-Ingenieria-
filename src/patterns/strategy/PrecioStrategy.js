/**
 * Patrón Strategy: intercambia la lógica de cálculo de precio en tiempo de ejecución.
 */
class PrecioStrategy {
    calcular(precio, producto) {
        throw new Error('Debe implementar calcular()');
    }

    getNombre() {
        return 'base';
    }
}

class PrecioListaStrategy extends PrecioStrategy {
    calcular(precio) {
        return precio;
    }

    getNombre() {
        return 'lista';
    }
}

class PrecioMayoristaStrategy extends PrecioStrategy {
    calcular(precio) {
        return Number((precio * 0.85).toFixed(2));
    }

    getNombre() {
        return 'mayorista';
    }
}

class PrecioPromocionStrategy extends PrecioStrategy {
    calcular(precio, producto) {
        if (producto.stock >= 10) {
            return Number((precio * 0.75).toFixed(2));
        }
        return precio;
    }

    getNombre() {
        return 'promocion';
    }
}

class PrecioContexto {
    constructor() {
        this.estrategias = {
            lista: new PrecioListaStrategy(),
            mayorista: new PrecioMayoristaStrategy(),
            promocion: new PrecioPromocionStrategy()
        };
        this.estrategiaActual = this.estrategias.lista;
    }

    establecerEstrategia(tipo) {
        this.estrategiaActual = this.estrategias[tipo] || this.estrategias.lista;
    }

    calcularPrecio(producto) {
        return this.estrategiaActual.calcular(producto.precio, producto);
    }

    getTipoActual() {
        return this.estrategiaActual.getNombre();
    }
}

module.exports = {
    PrecioContexto,
    PrecioListaStrategy,
    PrecioMayoristaStrategy,
    PrecioPromocionStrategy
};
