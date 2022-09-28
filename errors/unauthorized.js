const { ApplicationError } = require('./errors');

class Unauthorized extends ApplicationError {
  constructor(message) {
    super(401, message);
  }
}

module.exports = { Unauthorized };
