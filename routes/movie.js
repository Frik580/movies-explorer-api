const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlPattern } = require('../utils/constants');
const {
  createMovie,
  deleteMovie,
  getAllMovies,
} = require('../contollers/movie');

router.get('/movies', getAllMovies);

router.delete(
  '/movies/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().hex().length(24),
    }),
  }),
  deleteMovie,
);

router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(urlPattern),
    }),
  }),
  createMovie,
);

module.exports = router;
