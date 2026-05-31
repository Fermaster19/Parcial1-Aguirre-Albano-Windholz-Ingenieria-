const { PrecioMayoristaStrategy } = require('../src/patterns/strategy/PrecioStrategy');

describe('PrecioMayoristaStrategy', () => {
  test('15% de descuento sobre 100 da 85', () => {
    const estrategia = new PrecioMayoristaStrategy();
    const resultado = estrategia.calcular(100, { stock: 0 });

    expect(resultado).toBe(85);
  });
});
