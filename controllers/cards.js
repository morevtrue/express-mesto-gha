const Card = require('../models/card');

const { NotFoundError } = require('../errors/not-found-error');
const { BadRequestError } = require('../errors/bad-request-error');
// const { UnathorizedError } = require('../errors/unathorized-error');
const { ForbiddenError } = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({
        //   message: 'переданы некорректные данные в методы создания карточки'
        // });
        // return
        next(new BadRequestError('переданы некорректные данные в методы создания карточки'));
      }
      // res.status(500).send({ message: 'Ошибка по умолчанию.' });
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (userId !== card.owner._id.toString()) {
        throw new Error('NotCurrentUser');
      } else {
        Card.findByIdAndRemove(cardId)
          .orFail(new Error('NotValidId'))
          .then((cardCurrentUser) => {
            res.send(cardCurrentUser);
          })
          .catch((err) => {
            if (err.message === 'NotValidId') {
              // res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
              next(new NotFoundError('Передан несуществующий _id карточки.'));
            } else if (err.name === 'CastError') {
              // res.status(400).send({ message: 'Карточка с указанным _id не найдена.' });
              next(new BadRequestError('Карточка с указанным _id не найдена.'));
            } else {
              // res.status(500).send({ message: 'Ошибка по умолчанию.' });
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      if (err.message === 'NotCurrentUser') {
        // res.status(403).send({ message: 'карточка не принадлежит пользователю' });
        next(new ForbiddenError('карточка не принадлежит пользователю'));
      } else {
        // res.status(500).send({ message: 'Ошибка по умолчанию.' });
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        // res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Передан некорректный _id карточки.' });
        next(new BadRequestError('Передан некорректный _id карточки.'));
      } else {
        // res.status(500).send({ message: 'Ошибка по умолчанию.' });
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        // res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Передан некорректный _id карточки.' });
        next(new BadRequestError('Передан некорректный _id карточки.'));
      } else {
        // res.status(500).send({ message: 'Ошибка по умолчанию.' });
        next(err);
      }
    });
};
