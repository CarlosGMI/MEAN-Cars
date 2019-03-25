const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let userSchema = new mongoose.Schema({
    Cedula: {
        type: String,
        required: [true, "El campo de cédula es requerido"],
        unique: true
        //Acá podemos añadir una validación personalizada (una función)
    },
    Nombre: String,
    Apellido: String,
    Telefono: String,
    Email: {
        type: String,
        required: [true, "El campo de email es requerido"],
        unique: true
    },
    Contrasena: {
        type: String,
        required: [true, "El campo de contraseña es requerido"]
    },
    FechaNacimiento: Date,
    Roles: {
        type: [String],
        default: ['Cliente']
    },
    CreatedOn: {
        type: Date,
        default: Date.now
    },
    Concesionarios: [{type: Schema.Types.ObjectId, ref: 'Concesionario'}]
});

//Middleware para que al registrar un usuario, su contraseña siempre sea encriptada
userSchema.pre('save', function(next) {
    if(this.isModified('Contrasena') || this.isNew){
        bcrypt.genSalt(10, (err, salt) => {
            if(err)
                return next(err);
            bcrypt.hash(this.Contrasena, salt, (err, hash) => {
                if(err)
                    return next(err);
                this.Contrasena = hash;
                next(); 
            });
        });
    }
    else
        return next();
});

//Método para comparar que el usuario posea la contraseña correcta
userSchema.methods.comparePassword = async function(password) {
    let result = await bcrypt.compare(password, this.Contrasena);
    return result;
};

module.exports = mongoose.model('User', userSchema, 'C_Usuarios');