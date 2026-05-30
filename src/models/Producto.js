class Producto {
    constructor({ id, nombre, precio, stock, marca }) {
        this.id = id;
        this.nombre = nombre;
        this.precio = Number(precio);
        this.stock = Number(stock);
        this.marca = marca;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            precio: this.precio,
            stock: this.stock,
            marca: this.marca
        };
    }
}

module.exports = Producto;
