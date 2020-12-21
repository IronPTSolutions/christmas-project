const Post = require('../models/post.model');

module.exports.list = (req, res, next) => {
    Post.find()
        .then((posts) => {
            res.render('posts/list', { posts });
        })
        .catch(next);
};

module.exports.create = (req, res, next) => {
    res.render('posts/new');
};

module.exports.doCreate = (req, res, next) => {
    Post.create(req.body)
        .then((post) => {
            res.redirect(`/posts/${post.id}`);
        })
        .catch((error) => {
            res.render('posts/new', { error, post: req.body });
        });
};

module.exports.detail = (req, res, next) => {
    Post.findById(req.params.id)
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
                res.redirect('/posts');
            }
        })
        .catch(next);
};

module.exports.doEdit = (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, req.body)
        .then((post) => {
            if (post) {
                res.render('posts/detail', { post });
            } else {
                res.redirect('/posts');
            }
        })
        .catch((error) => {
            res.render('posts/edit', { error: error, post: req.body });
        });
};

module.exports.delete = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/posts');
        })
        .catch(next);
};
