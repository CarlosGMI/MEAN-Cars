const mongoose = require("mongoose"); //Requerimos Mongoose
const config = require("./config.json"); //Requerimos el archivo con los datos de conexión a la base de datos

const host = config.db.host; //Obtenemos el host del archivo config
const port = config.db.port; //Obtenemos el puerto del archivo config
const dbName = config.db.dbName; //Obtenemos el nombre de la base de datos del archivo config
const url = `mongodb://${host}:${port}/${dbName}`; //Construimos el string o URL de conexión

mongoose.connect(url, { useNewUrlParser: true }, () => console.log("Conexión exitosa con MongoDB")); //Conexión a MongoDB

module.exports = {
    connection: mongoose.connection,
};