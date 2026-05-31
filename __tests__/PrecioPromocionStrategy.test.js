const { PrecioPromocionStrategy } = require('../src/patterns/strategy/PrecioStrategy');

describe('PrecioPromocionStrategy', () => {
  test('stock >= 10 aplica 25% de descuento sobre 100 da 75', () => {
    const estrategia = new PrecioPromocionStrategy();
    const resultado = estrategia.calcular(100, { stock: 10 });

    expect(resultado).toBe(75);
  });

  test('stock < 10 no aplica descuento y mantiene 100', () => {
    const estrategia = new PrecioPromocionStrategy();
    const resultado = estrategia.calcular(100, { stock: 9 });

    expect(resultado).toBe(100);
  });
});
