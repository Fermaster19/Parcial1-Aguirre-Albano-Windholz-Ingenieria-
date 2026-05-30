/**
 * Vista: solo renderiza la interfaz (DOM), sin lógica de negocio.
 */
class ProductoView {
    constructor() {
        this.lista = document.getElementById('lista');
        this.resultadoBusqueda = document.getElementById('resultadoBusqueda');
    }

    limpiarLista() {
        this.lista.innerHTML = '';
    }

    renderizarLista(productos) {
        this.limpiarLista();

        if (!productos.length) {
            this.lista.innerHTML = '<li>No hay productos registrados</li>';
            return;
        }

        productos.forEach((producto) => {
            const item = document.createElement('li');
            item.innerHTML = `
                <div>${producto.descripcion}</div>
                <div class="precio-calculado">
                    Precio con estrategia "${producto.estrategia}": $${producto.precioCalculado}
                </div>
                <button data-accion="eliminar" data-id="${producto.id}">Eliminar</button>
                <button data-accion="editar" data-id="${producto.id}">Editar</button>
            `;
            this.lista.appendChild(item);
        });
    }

    obtenerDatosFormulario() {
        return {
            nombre: document.getElementById('nombre').value,
            precio: document.getElementById('precio').value,
            stock: document.getElementById('stock').value,
            marca: document.getElementById('marca').value
        };
    }

    limpiarFormulario() {
        document.getElementById('nombre').value = '';
        document.getElementById('precio').value = '';
        document.getElementById('stock').value = '';
        document.getElementById('marca').value = '';
    }

    obtenerEstrategia() {
        return document.getElementById('estrategia').value;
    }

    obtenerIdBusqueda() {
        return document.getElementById('buscarId').value.trim();
    }

    mostrarResultadoBusqueda(html, esError = false) {
        this.resultadoBusqueda.innerHTML = `<li class="${esError ? 'mensaje-error' : ''}">${html}</li>`;
    }

    limpiarBusqueda() {
        this.resultadoBusqueda.innerHTML = '';
    }

    pedirEdicion(producto) {
        const nombre = prompt('Nuevo nombre:', producto.nombre);
        if (nombre === null) return null;

        const precio = prompt('Nuevo precio:', producto.precio);
        if (precio === null) return null;

        const stock = prompt('Nuevo stock:', producto.stock);
        if (stock === null) return null;

        const marca = prompt('Nueva marca:', producto.marca);
        if (marca === null) return null;

        return { nombre, precio, stock, marca };
    }
}
