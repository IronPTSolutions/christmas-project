const express = require('express');
const passport = require('passport');
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

const router = express.Router();
const postsController = require('../controllers/posts.controller');
const commentsController = require('../controllers/comments.controller');
const usersController = require('../controllers/users.controller');
const secure = require('../middlewares/secure.middleware');

router.get('/posts', secure.isAuthenticated, postsController.list);
router.get('/posts/new', secure.isAuthenticated, postsController.create);
router.post('/posts', secure.isAuthenticated, postsController.doCreate);
router.get('/posts/:id', secure.isAuthenticated, postsController.detail);
router.get('/posts/:id/edit', secure.isAuthenticated, postsController.edit);
router.post('/posts/:id/edit', secure.isAuthenticated, postsController.doEdit);
router.post('/posts/:id/delete', secure.isAuthenticated, postsController.delete);
router.post('/posts/:postId/comments', secure.isAuthenticated, commentsController.create);
router.post('/logout', secure.isAuthenticated, usersController.logout);

router.get('/activate', usersController.activate);
router.get('/register', usersController.register);
router.post('/register', usersController.doRegister);
router.get('/login', usersController.login);
router.post('/login', usersController.doLogin);
router.get('/authenticate/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/authenticate/google/cb', usersController.loginWithGoogle)
router.get('/users', secure.isAuthenticated, secure.checkRole('admin'), usersController.list);

router.get('/', (req, res) => res.redirect('/posts'));

module.exports = router;
