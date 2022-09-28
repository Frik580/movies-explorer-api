const { ApplicationError } = require('./errors');

class Forbidden extends ApplicationError {
  constructor() {
    super(403, 'Невозможно удалить карточку');
  }
}

module.exports = { Forbidden };
