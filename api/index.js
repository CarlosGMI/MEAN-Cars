let express = require('express'); //Referenciar Express
let homeRoute = require('./routes/home'); //Referenciar la ruta de home
let db = require("./config/db"); //Referenciamos el archivo de conexión con MongoDB

let app = express(); //Crear la aplicación
let PORT = process.env.PORT || 3000; //El puerto donde se ejecuta la aplicación

app.use(homeRoute);

db.connection.once('error', (err) => {
    console.log(`Ha ocurrido un error durante la conexión con la base de datos: ${err}`);
});

db.connection.once('open', () => {
    app.listen(PORT, (err) => {
        if(err){
            console.log(`Ha ocurrido un error al iniciar el servidor de Express: ${err}`);
            return
        }
        console.log(`Listening on port ${PORT}...`);
    });
});