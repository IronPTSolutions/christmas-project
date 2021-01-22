const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => next(null, user))
    .catch(next);
});

passport.use('local-auth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, next) => {
  User.findOne({ email })
    .then(user => {
      if (!user) {
        next(null, null, { email: 'Invalid email or password'})
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (match) {
              // Validamos si el usuario ha activado ya su cuenta una vez sabemos que ha introducido bien su contraseña. 
              // De este modo prevenimos que puedan averiguar que usuarios están registrados en nuestra base de datos (fuerza bruta) y
              // mejoramos la experiencia de usuario.
              if (user.verified && user.verified.date) {
                next(null, user)
              } else {
                next(null, null, { email: 'Your account is not validated jet, please check your email' })
              }
            } else {
              next(null, null, { email: 'Invalid email or password' })
            }
          })
      }
    }).catch(next)
}));
