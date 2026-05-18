const API = 'http://localhost:3000/productos';

const lista = document.getElementById('lista');
const resultadoBusqueda = document.getElementById('resultadoBusqueda');

async function cargarProductos() {

    const respuesta = await fetch(API);
    const productos = await respuesta.json();

    lista.innerHTML = '';

    productos.forEach(producto => {

        lista.innerHTML += `
            <li>
                ${producto.nombre} - $${producto.precio}
                | Stock: ${producto.stock}
                | Marca: ${producto.marca}

                <button onclick="eliminarProducto(${producto.id})">
                    Eliminar
                </button>

                <button onclick="editarProducto(
                    ${producto.id},
                    '${String(producto.nombre).replace(/'/g, "\\'")}',
                    ${producto.precio},
                    ${producto.stock},
                    '${String(producto.marca).replace(/'/g, "\\'")}'
                )">
                    Editar
                </button>
            </li>
        `;
    });
}

async function crearProducto() {

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const marca = document.getElementById('marca').value;

    await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            precio,
            stock,
            marca
        })
    });

    cargarProductos();
}

async function eliminarProducto(id) {

    await fetch(`${API}/${id}`, {
        method: 'DELETE'
    });

    cargarProductos();
}

async function editarProducto(id, nombreActual, precioActual, stockActual, marcaActual) {

    const nombre = prompt('Nuevo nombre:', nombreActual);
    const precio = prompt('Nuevo precio:', precioActual);
    const stock = prompt('Nuevo stock:', stockActual);
    const marca = prompt('Nueva marca:', marcaActual);

    await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            precio,
            stock,
            marca
        })
    });

    cargarProductos();
}
async function buscarPorId() {

    const idTexto = document.getElementById('buscarId').value.trim();
    const id = Number(idTexto);

    resultadoBusqueda.innerHTML = '';

    if(!Number.isInteger(id) || id <= 0){
        resultadoBusqueda.innerHTML = '<li>Ingresa un ID válido</li>';
        return;
    }

    try {
        const respuesta = await fetch(`${API}/${id}`);
        const producto = await respuesta.json();

        if(!respuesta.ok || producto.mensaje){
            resultadoBusqueda.innerHTML = `
                <li>${producto.mensaje || 'No se pudo buscar el producto'}</li>
            `;
            return;
        }

        resultadoBusqueda.innerHTML = `
            <li>
                ${producto.nombre} - $${producto.precio}
                | Stock: ${producto.stock}
                | Marca: ${producto.marca}
            </li>
        `;
    } catch (error) {
        resultadoBusqueda.innerHTML = '<li>Error de conexión con el servidor</li>';
    }
}
cargarProductos();