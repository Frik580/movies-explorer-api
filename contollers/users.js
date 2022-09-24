const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { Unauthorized } = require('../errors/unauthorized');
const { ConflictError } = require('../errors/conflicterror');
const { BadRequest } = require('../errors/badrequest');
const { NotFound } = require('../errors/notfound');
const { getJwtToken } = require('../utils/jwt');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const newUser = {
        name: user.name,
        email: user.email,
        _id: user._id,
      };
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Unauthorized('Неправильные почта или пароль');
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((isValidPassword) => {
        if (!isValidPassword) {
          throw new Unauthorized('Неправильные почта или пароль');
        }
        const token = getJwtToken(user.id);
        res.status(200).send({ token });
      }))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь с указанным id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  updateUser,
  login,
  getCurrentUser,
};
