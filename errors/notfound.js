const { ApplicationError } = require('./errors');

class NotFound extends ApplicationError {
  constructor(message) {
    super(404, message);
  }
}

module.exports = { NotFound };
