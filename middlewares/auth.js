const { getPayload } = require('../utils/jwt');
const { Unauthorized } = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(authorization, req.path, req.method);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация!!');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = getPayload(token);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
