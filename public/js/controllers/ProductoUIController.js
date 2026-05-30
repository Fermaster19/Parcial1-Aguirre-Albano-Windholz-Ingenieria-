/**
 * Controlador (frontend): coordina Modelo y Vista.
 */
class ProductoUIController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.productosCache = [];
    }

    iniciar() {
        document.getElementById('btnAgregar').addEventListener('click', () => this.crear());
        document.getElementById('btnRecargar').addEventListener('click', () => this.cargarLista());
        document.getElementById('btnBuscar').addEventListener('click', () => this.buscarPorId());
        document.getElementById('estrategia').addEventListener('change', () => this.cargarLista());

        this.vista.lista.addEventListener('click', (evento) => {
            const boton = evento.target.closest('button');
            if (!boton) return;

            const id = Number(boton.dataset.id);
            if (boton.dataset.accion === 'eliminar') {
                this.eliminar(id);
            } else if (boton.dataset.accion === 'editar') {
                this.editar(id);
            }
        });

        this.cargarLista();
    }

    async cargarLista() {
        try {
            const estrategia = this.vista.obtenerEstrategia();
            const productos = await this.modelo.obtenerTodos(estrategia);
            this.productosCache = productos;
            this.vista.renderizarLista(productos);
        } catch {
            this.vista.limpiarLista();
            this.vista.lista.innerHTML = '<li class="mensaje-error">Error de conexión con el servidor</li>';
        }
    }

    async crear() {
        const datos = this.vista.obtenerDatosFormulario();
        await this.modelo.crear(datos);
        this.vista.limpiarFormulario();
        await this.cargarLista();
    }

    async eliminar(id) {
        await this.modelo.eliminar(id);
        await this.cargarLista();
    }

    async editar(id) {
        const producto = this.productosCache.find((p) => p.id === id);
        if (!producto) return;

        const datos = this.vista.pedirEdicion(producto);
        if (!datos) return;

        await this.modelo.actualizar(id, datos);
        await this.cargarLista();
    }

    async buscarPorId() {
        this.vista.limpiarBusqueda();

        const idTexto = this.vista.obtenerIdBusqueda();
        const id = Number(idTexto);

        if (!Number.isInteger(id) || id <= 0) {
            this.vista.mostrarResultadoBusqueda('Ingresa un ID válido', true);
            return;
        }

        try {
            const estrategia = this.vista.obtenerEstrategia();
            const { respuesta, datos } = await this.modelo.obtenerPorId(id, estrategia);

            if (!respuesta.ok || datos.mensaje) {
                this.vista.mostrarResultadoBusqueda(
                    datos.mensaje || 'No se pudo buscar el producto',
                    true
                );
                return;
            }

            this.vista.mostrarResultadoBusqueda(`
                ${datos.descripcion}<br>
                <span class="precio-calculado">
                    Precio con estrategia "${datos.estrategia}": $${datos.precioCalculado}
                </span>
            `);
        } catch {
            this.vista.mostrarResultadoBusqueda('Error de conexión con el servidor', true);
        }
    }
}
