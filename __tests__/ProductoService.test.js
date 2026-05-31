const ProductoService = require('../src/services/ProductoService');
const ValidationError = require('../src/errors/ValidationError');

describe('ProductoService', () => {
  test('validarDatos normaliza y retorna valores válidos', () => {
    const service = new ProductoService({});
    const datos = {
      nombre: '  Televisor  ',
      precio: '123.45',
      stock: '10',
      marca: ' LG '
    };

    const resultado = service.validarDatos(datos);

    expect(resultado).toEqual({
      nombre: 'Televisor',
      marca: 'LG',
      precio: 123.45,
      stock: 10
    });
  });

  test('validarDatos lanza ValidationError cuando falta nombre', () => {
    const service = new ProductoService({});

    expect(() => service.validarDatos({ precio: 100, stock: 1, marca: 'Sony' }))
      .toThrow(ValidationError);
  });
});
