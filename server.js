const express = require('express');
const cors = require('cors');
const path = require('path');
const productoRoutes = require('./src/routes/productoRoutes');
const DatabaseSingleton = require('./src/config/DatabaseSingleton');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

DatabaseSingleton.obtenerInstancia();

app.use('/productos', productoRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
    console.log('Frontend: http://localhost:3000');
});
