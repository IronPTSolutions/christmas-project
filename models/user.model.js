const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/;
const SALT_ROUNDS = 10;

const userSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required',
    trim: true
  },
  email: {
    type: String,
    required: 'Email is required',
    unique: true,
    lowercase: true,
    trim: true,
    match: [EMAIL_PATTERN, 'Invalid email']
  },
  password: {
    type: String,
    required: 'Password is required',
    match: [PASSWORD_PATTERN, 'Password needs at least 8 characters']
  }
}, { timestamps: true });

/**
 * Este método se va a siempre antes de guardar el usuario en la base de datos.
 * 
 * Es importante que no usemos una función flecha como segundo argumento, 
 * ya que 'this' representa el usuario que se va guardar en la base de datos.
 * 
 * Cuando estemos listos para que el usuario se guarde en la base de datos invocaremos a next().
 * En el caso de que tengamos algún error lo pasaremos como primer argumento a la función next(error), de esta forma detenemos
 * el flujo y no mandamos la operación de guardado a la base de datos.
 */
userSchema.pre('save', function(next) {
  const user = this;

  // Siempre guardaremos la contraseña encriptada en la base de datos,
  // es por eso que tenemos que comprobar primero si este atributo del 
  // usuario ha cambiado o no (podríamos estar actualizando solo el nombre del usuario).
  // 
  // Casos:
  // - Si el password ha sido modificado => está en claro => calculamos el hash y lo guardamos encriptado.
  // - Si el password no ha sido modificado => ya está encriptado => no tenemos que hacer nada =D.
  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then(hashedPassword => {
        user.password = hashedPassword;
        next();
      })
      .catch(next);
  } else {
    next();
  }
})

const User = mongoose.model('User', userSchema);
module.exports = User;
