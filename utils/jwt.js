const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const getJwtToken = (id) => jwt.sign(
  { _id: id },
  NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
  { expiresIn: '7d' },
);
const getPayload = (token) => jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');

module.exports = { getJwtToken, getPayload };
