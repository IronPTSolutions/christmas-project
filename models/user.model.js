const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^.{8,}$/;

const userSchema = new Schema({
  name: {
    type: String,
    required: 'User name is mandatory',
    trim: true
  },
  email: {
    type: String,
    required: 'Email is required',
    match: [EMAIL_PATTERN, 'Invalid email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: 'Password is required',
    match: [PASSWORD_PATTERN, 'Password needs at least 8 chars']
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
