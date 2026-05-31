const {
  AlertaStockBajoDecorator,
  EtiquetaMarcaPremiumDecorator,
  ProductoComponente
} = require('../src/patterns/decorator/ProductoDecorator');

describe('ProductoDecorator', () => {
  test('AlertaStockBajoDecorator agrega etiqueta cuando stock es menor a 5', () => {
    const producto = { nombre: 'Cargador', precio: 10, stock: 3, marca: 'Generic' };
    const componenteBase = new ProductoComponente(producto);
    const decorator = new AlertaStockBajoDecorator(componenteBase);

    const descripcion = decorator.obtenerDescripcion();

    expect(descripcion).toContain('⚠ STOCK BAJO');
    expect(descripcion).toContain('Cargador - $10 | Stock: 3 | Marca: Generic');
  });

  test('EtiquetaMarcaPremiumDecorator agrega etiqueta de marca premium usando mock', () => {
    const producto = { nombre: 'Teléfono', precio: 500, stock: 20, marca: 'Apple' };
    const componenteMock = {
      producto,
      obtenerDescripcion: jest.fn().mockReturnValue('Teléfono - $500 | Stock: 20 | Marca: Apple')
    };
    const decorator = new EtiquetaMarcaPremiumDecorator(componenteMock);

    const descripcion = decorator.obtenerDescripcion();

    expect(componenteMock.obtenerDescripcion).toHaveBeenCalled();
    expect(descripcion).toContain('★ MARCA PREMIUM');
    expect(descripcion).toBe('Teléfono - $500 | Stock: 20 | Marca: Apple | ★ MARCA PREMIUM');
  });
});
