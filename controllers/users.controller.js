const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.register = (req, res, next) => {
  res.render('users/register');
}

module.exports.doRegister = (req, res, next) => {

  function renderWithErrors(errors) {
    res.render('users/register', {
      errors: errors,
      user: req.body
    });
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        renderWithErrors({ email: 'Already exists an user with this email'});
      } else {
        return User.create(req.body)
          .then(user => res.redirect('/posts'))
      }
    }).catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors);
      } else {
        next(error)
      }
    });
}

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => res.render('users/list', { users }))
    .catch(next)
}
