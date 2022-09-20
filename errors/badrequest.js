const { ApplicationError } = require('./errors');

class BadRequest extends ApplicationError {
  constructor(message) {
    super(400, message);
  }
}

module.exports = { BadRequest };
