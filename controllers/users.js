const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NotFoundError } = require('../errors/not-found-error');
const { BadRequestError } = require('../errors/bad-request-error');
const { UnathorizedError } = require('../errors/unathorized-error');
const { ConflictError } = require('../errors/conflict-error');

function getUser(userId, res, next) {
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        // res.status(404).send({ message: 'Указанный _id не существует.' });
        next(new NotFoundError('Указанный _id не существует.'));
      } else if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
        next(new BadRequestError('Пользователь по указанному _id не найден.'));
      } else {
        // res.status(500).send({ message: 'Ошибка по умолчанию.' });
        next(err);
      }
    });
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      // res.status(500).send({ message: 'Ошибка по умолчанию.' });
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  getUser(userId, res, next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  getUser(userId, res, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        // res.status(400).send({
        //   message: 'Переданы некорректные данные при создании пользователя.',
        // });
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        // res.status(500).send({ message: 'Ошибка по умолчанию.' });
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        });
      res.send({ message: 'Авторизация прошла успешно!' });
    })
    .catch((err) => {
      // res.status(401).send({ message: err.message });
      next(new UnathorizedError(`${err.message}`));
    });
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        // res.status(400).send({
        //   message: 'Переданы некорректные данные при создании пользователя.',
        // });
        next(BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        // res.status(500).send({ message: 'Ошибка по умолчанию.' });
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        // res.status(400).send({
        //   message: 'Переданы некорректные данные при создании пользователя.',
        // });
        next(BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        // res.status(500).send({ message: 'Ошибка по умолчанию.' });
        next(err);
      }
    });
};
