jest.mock('../src/config/DatabaseSingleton', () => ({
    obtenerInstancia: jest.fn()
}));

const DatabaseSingleton = require('../src/config/DatabaseSingleton');
const ProductoModel = require('../src/models/ProductoModel');
const Producto = require('../src/models/Producto');

describe('ProductoModel', () => {
    let dbMock;

    beforeEach(() => {
        dbMock = { consultar: jest.fn() };
        DatabaseSingleton.obtenerInstancia.mockReturnValue(dbMock);
    });

    test('obtenerTodos mapea filas SQL a instancias de Producto', async () => {
        dbMock.consultar.mockResolvedValue([
            { id: 1, nombre: 'TV', precio: 100, stock: 5, marca: 'LG' }
        ]);

        const modelo = new ProductoModel();
        const productos = await modelo.obtenerTodos();

        expect(dbMock.consultar).toHaveBeenCalledWith('SELECT * FROM productos');
        expect(productos).toHaveLength(1);
        expect(productos[0]).toBeInstanceOf(Producto);
        expect(productos[0].nombre).toBe('TV');
        expect(productos[0].precio).toBe(100);
    });

    test('obtenerPorId retorna null cuando no hay filas', async () => {
        dbMock.consultar.mockResolvedValue([]);

        const modelo = new ProductoModel();
        const producto = await modelo.obtenerPorId(99);

        expect(producto).toBeNull();
    });

    test('obtenerPorId retorna Producto cuando existe la fila', async () => {
        dbMock.consultar.mockResolvedValue([
            { id: 2, nombre: 'Mouse', precio: 25, stock: 10, marca: 'Logitech' }
        ]);

        const modelo = new ProductoModel();
        const producto = await modelo.obtenerPorId(2);

        expect(producto).toBeInstanceOf(Producto);
        expect(producto.id).toBe(2);
    });
});
