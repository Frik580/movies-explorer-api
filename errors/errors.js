class ApplicationError extends Error {
  constructor(status = 500, message = 'Internal server error') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorStatus = {
  notCorrect: 400,
  notFound: 404,
  serverError: 500,
};

module.exports = {
  ApplicationError, errorStatus,
};
