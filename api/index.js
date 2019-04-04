let express = require('express'); //Referenciar Express
let passport = require('passport');
let cookieParser = require('cookie-parser'); //Referenciamos el middleware para manejar las cookies
let routes = require('./routes/routes'); //Referenciar las rutas
let db = require("./config/db"); //Referenciamos el archivo de conexión con MongoDB
let bodyParser = require('body-parser'); //Referenciamos el middleware para manejar el body en POST requests

let app = express(); //Crear la aplicación
let PORT = process.env.PORT || 3000; //El puerto donde se ejecuta la aplicación

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);

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