const jwt = require('jsonwebtoken');
const { UnathorizedError } = require('../errors/unathorized-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const authorization = req.cookies.jwt;

  if (!authorization) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw new UnathorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw new UnathorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};