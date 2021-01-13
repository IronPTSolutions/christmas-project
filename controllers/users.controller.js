
module.exports.register = (req, res, next) => {
  // pintar vista formulario de registro
  next();
}

module.exports.doRegister = (req, res, next) => {
  // Validar registro, crear usuario y redirigir a /posts si todo es correcto.
  next();
}
