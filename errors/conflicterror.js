const { ApplicationError } = require('./errors');

class ConflictError extends ApplicationError {
  constructor(message) {
    super(409, message);
  }
}

module.exports = { ConflictError };
