require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const centerErrors = require('./middlewares/errors');

const { NODE_ENV, DB_ROUTE } = process.env;

const app = express();

app.use(requestLogger);

app.use(cors());

app.use(helmet());

app.use(limiter);

const { PORT = 3000 } = process.env;

mongoose.connect(
  NODE_ENV === 'production' ? DB_ROUTE : 'mongodb://localhost:27017/moviesdb',
);

app.use(express.json());

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(centerErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
