const router = require('express').Router();

const {
  createMovie,
  deleteMovie,
  getAllMovies,
} = require('../contollers/movie');
const {
  validateDeleteMovie,
  validateCreateMovie,
} = require('../middlewares/validation');

router.get('/movies', getAllMovies);

router.delete('/movies/:_id', validateDeleteMovie, deleteMovie);

router.post('/movies', validateCreateMovie, createMovie);

module.exports = router;
