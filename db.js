const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda'
});

connection.connect((err) => {
    if(err){
        console.log('Error de conexión:', err);
    } else {
        console.log('MySQL conectado');
    }
});

module.exports = connection;