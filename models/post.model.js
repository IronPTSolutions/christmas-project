const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://antitrustlair.files.wordpress.com/2013/02/post_danmark.jpg?w=420&h=279',
    },
    text: {
        type: String,
        required: true,
        minlength: 10,
    }
});

schema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    options: {
        sort: { createdAt: -1 },
        limit: 10
    }
})

const Post = mongoose.model('Post', schema);

module.exports = Post;
