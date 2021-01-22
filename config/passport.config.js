const passport = require('passport');
const mongoose = require('mongoose');
const createError = require('http-errors');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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


passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.G_CLIENT_ID,
  clientSecret: process.env.G_CLIENT_SECRET,
  callbackURL: process.env.G_REDIRECT_URI || '/authenticate/google/cb',
}, (accessToken, refreshToken, profile, next) => {
  // No necesitamos guardar el token de acceso de google xq no necesitamos pedir a google ninguna información adicional
  // de los servicios del usuario que tenga en google.
  const googleId = profile.id;
  const name = profile.displayName;
  const email = profile.emails[0] ? profile.emails[0].value : undefined;

  if (googleId && name && email) {
    User.findOne({ $or: [
        { email},
        {'social.google': googleId }
      ]})
      .then(user => {
        if (!user) {
          user = new User({
            name,
            email,
            password: mongoose.Types.ObjectId(),
            social: {
              google: googleId
            },
            verified: {
              date: new Date(),
              token: null
            }
          });
          return user.save()
            .then(user => next(null, user))
        } else {
          next(null, user);
        }
      }).catch(next)
  } else {
    next(null, null, { oauth: 'invalid google oauth response' })
  }
}));
