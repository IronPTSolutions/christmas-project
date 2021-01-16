const createError = require('http-errors');
const mongoose = require('mongoose');
const Post = require('../models/post.model');

module.exports.list = (req, res, next) => {
  Post.find()
    .then((posts) => res.render('posts/list', { posts }))
    .catch(next);
};

module.exports.create = (req, res, next) => {
  res.render('posts/new');
};

module.exports.doCreate = (req, res, next) => {
  Post.create({
    ...req.body,
    author: req.currentUser.id,
  })
    .then((post) => res.redirect(`/posts/${post.id}`))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('posts/new', {
          errors: error.errors,
          post: req.body,
        });
      } else {
        next(error);
      }
    });
};

module.exports.detail = (req, res, next) => {
  console.log(req.headers);

  Post.findById(req.params.id)
    .populate('comments')
    .then((post) => {
      if (post) {
        res.render('posts/detail', { post });
      } else {
        res.redirect('/posts');
      }
    })
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.render('posts/edit', { post });
      } else {
        next(createError(404, 'Post does not exists'));
      }
    })
    .catch(next);
};

module.exports.doEdit = (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { runValidators: true })
    .then((post) => {
      if (post) {
        res.render('posts/detail', { post });
      } else {
        next(createError(404, 'Post does not exists'));
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        const post = req.body;
        post.id = req.params.id;
        res.render('posts/edit', {
          errors: error.errors,
          post: post,
        });
      } else {
        next(error);
      }
    });
};

module.exports.delete = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id)
    .then((post) => {
      if (post) {
        res.redirect('/posts');
      } else {
        next(createError(404, 'Post does not exists'));
      }
    })
    .catch(next);
};
