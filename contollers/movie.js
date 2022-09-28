const Movie = require('../models/movie');
const { BadRequest } = require('../errors/badrequest');
const { Forbidden } = require('../errors/forbidden');
const { NotFound } = require('../errors/notfound');
const {
  BAD_REQUEST,
  NOT_FOUND_FILM,
  BAD_REQUEST_FILM,
} = require('../utils/errors-message');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFound(NOT_FOUND_FILM);
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie)
          .then(() => res.status(200).send(movie))
          .catch(next);
      } else {
        throw new Forbidden();
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BAD_REQUEST_FILM));
      } else {
        next(err);
      }
    });
};

const getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

module.exports = {
  createMovie,
  deleteMovie,
  getAllMovies,
};
