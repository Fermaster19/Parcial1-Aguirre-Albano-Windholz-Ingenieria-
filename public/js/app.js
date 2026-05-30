const modelo = new ProductoApiModel();
const vista = new ProductoView();
const controlador = new ProductoUIController(modelo, vista);

controlador.iniciar();
