const jwt = require('jsonwebtoken');
const { UnathorizedError } = require('../errors/unathorized-error');

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    throw new UnathorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnathorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
