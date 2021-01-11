const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  title: {
    type: String,
    required: 'Title is required',
    minlength: [3, 'Title needs at least 3 characters']
  },
  message: {
    type: String,
    required: 'The comment description is required',
    minlength: [10, 'Message needs at least 3 characters']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
