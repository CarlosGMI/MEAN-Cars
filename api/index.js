let express = require('express'); //Referenciar Express
let homeRoute = require('./routes/home'); //Referenciar la ruta de home
let app = express(); //Crear la aplicación
let PORT = process.env.PORT || 3000; //El puerto donde se ejecuta la aplicación

app.use(homeRoute);
app.listen(3000, () => console.log(`Listening on port ${PORT}...`));