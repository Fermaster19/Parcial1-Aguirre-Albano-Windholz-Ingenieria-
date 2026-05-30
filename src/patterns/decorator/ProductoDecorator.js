/**
 * Patrón Decorator: añade información de presentación sin modificar el objeto base.
 */
class ProductoComponente {
    constructor(producto) {
        this.producto = producto;
    }

    obtenerDescripcion() {
        const p = this.producto;
        return `${p.nombre} - $${p.precio} | Stock: ${p.stock} | Marca: ${p.marca}`;
    }
}

class ProductoDecorator {
    constructor(componente) {
        this.componente = componente;
        this.producto = componente.producto;
    }

    obtenerDescripcion() {
        return this.componente.obtenerDescripcion();
    }
}

class AlertaStockBajoDecorator extends ProductoDecorator {
    obtenerDescripcion() {
        let texto = this.componente.obtenerDescripcion();
        if (this.producto.stock < 5) {
            texto += ' | ⚠ STOCK BAJO';
        }
        return texto;
    }
}

class EtiquetaMarcaPremiumDecorator extends ProductoDecorator {
    obtenerDescripcion() {
        let texto = this.componente.obtenerDescripcion();
        const marcasPremium = ['samsung', 'apple', 'sony', 'lg'];
        if (marcasPremium.includes(String(this.producto.marca).toLowerCase())) {
            texto += ' | ★ MARCA PREMIUM';
        }
        return texto;
    }
}

function decorarProducto(producto) {
    let componente = new ProductoComponente(producto);
    componente = new AlertaStockBajoDecorator(componente);
    componente = new EtiquetaMarcaPremiumDecorator(componente);
    return componente;
}

module.exports = {
    ProductoComponente,
    ProductoDecorator,
    AlertaStockBajoDecorator,
    EtiquetaMarcaPremiumDecorator,
    decorarProducto
};
