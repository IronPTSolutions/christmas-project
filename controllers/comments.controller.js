const createError = require('http-errors');
const mongoose = require('mongoose');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

module.exports.create = (req, res, next) => {
  const { postId } = req.params;
  const { title, message } = req.body;
  
  let commentPost;
  Post.findById(postId)
    .populate('comments')
    .then(post => {
      commentPost =  post;
      if (!post) {
        next(createError(404, 'Post not found'));
      } else {
        const comment = new Comment({
          title: title,
          message: message,
          post: post.id
        })

        return comment.save()
          .then(comment => res.redirect(`/posts/${post.id}`));
      }
    }).catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('posts/detail', {
          post: commentPost,
          errors: error.errors
        });
      } else {
        next(error);
      }
    });
}
