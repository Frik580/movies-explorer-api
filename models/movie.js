const mongoose = require('mongoose');
const { urlPattern } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return urlPattern.test(v);
      },
      message: 'Передана некорректная ссылка на постер к фильму',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator(v) {
        return urlPattern.test(v);
      },
      message: 'Передана некорректная ссылка на трейлер фильма',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        return urlPattern.test(v);
      },
      message: 'Передана некорректная ссылка на изображение к фильму',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
