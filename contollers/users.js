const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { Unauthorized } = require('../errors/unauthorized');
const { ConflictError } = require('../errors/conflicterror');
const { BadRequest } = require('../errors/badrequest');
const { NotFound } = require('../errors/notfound');
const { getJwtToken } = require('../utils/jwt');
const {
  CONFLICT_ERROR_USER,
  BAD_REQUEST_USER,
  UNAUTHORIZED,
  NOT_FOUND_USER,
  CONFLICT_ERROR_USER_EMAIL,
} = require('../utils/errors-message');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
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
        next(new ConflictError(CONFLICT_ERROR_USER));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_USER));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new Unauthorized(UNAUTHORIZED);
    })
    .then((user) => bcrypt.compare(password, user.password).then((isValidPassword) => {
      if (!isValidPassword) {
        throw new Unauthorized(UNAUTHORIZED);
      }
      const token = getJwtToken(user.id);
      res.status(200).send({ token });
    }))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound(NOT_FOUND_USER);
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
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
      throw new NotFound(NOT_FOUND_USER);
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(CONFLICT_ERROR_USER_EMAIL));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_USER));
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
