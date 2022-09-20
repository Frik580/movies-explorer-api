const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlPattern } = require('../utils/constants');
const {
  getUser,
  getAllUsers,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../contollers/users');

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().hex().length(24),
    }),
  }),
  getUser,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(urlPattern),
    }),
  }),
  updateAvatar,
);

module.exports = router;
