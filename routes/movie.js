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
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(urlPattern),
      trailerLink: Joi.string().required().pattern(urlPattern),
      thumbnail: Joi.string().required().pattern(urlPattern),
      movieId: Joi.required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

module.exports = router;
