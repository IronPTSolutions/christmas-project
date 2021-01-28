require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');

require('./config/hbs.config');
require('./config/db.config');
const session = require('./config/session.config');
require('./config/passport.config');

const app = express();

/**
 * Middlewares
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // la variable path se podrá usar desde cualquier vista de hbs (/register, /posts)
  res.locals.path = req.path;

  // la variable currentUser representa al usuario logeado
  res.locals.currentUser = req.user;

  // Cargamos los mensajes de la cookie de flash en los locals para poder usarlos desde todas las vistas
  const flashData = req.flash('data')
    .reduce((data, message) => {
      return {...data, ...JSON.parse(message)}
    }, {});
  Object.assign(res.locals, flashData);
  
  // Damos paso al siguiente middleware
  next();
});

/**
 * View setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Configure routes
 */
const router = require('./config/routes.config');
app.use('/', router);

app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.error(error);
  let status = error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {},
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});
