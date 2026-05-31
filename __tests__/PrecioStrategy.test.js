const { PrecioListaStrategy } = require('../src/patterns/strategy/PrecioStrategy');

describe('PrecioListaStrategy', () => {
  test('precio sin cambio', () => {
    const estrategia = new PrecioListaStrategy();
    const resultado = estrategia.calcular(100, { stock: 0 });

    expect(resultado).toBe(100);
  });
});
