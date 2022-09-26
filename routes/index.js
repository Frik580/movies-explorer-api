const router = require('express').Router();
const { createUser, login } = require('../contollers/users');
const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const movieRouter = require('./movie');

const { NotFound } = require('../errors/notfound');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/', usersRouter);
router.use('/', movieRouter);
router.use('*', () => {
  throw new NotFound('Страница не найдена');
});

module.exports = router;
