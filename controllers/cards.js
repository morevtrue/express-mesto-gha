const Card = require('../models/card');

const { NotFoundError } = require('../errors/not-found-error');
const { BadRequestError } = require('../errors/bad-request-error');
const { ForbiddenError } = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('переданы некорректные данные в методы создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным id не существует'))
    .then((card) => {
      if (userId !== card.owner._id.toString()) {
        throw new ForbiddenError('карточка не принадлежит пользователю');
      } else {
        Card.findByIdAndRemove(cardId)
          .orFail(() => new NotFoundError('Карточка с указанным id не существует'))
          .then((cardCurrentUser) => {
            res.send(cardCurrentUser);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new BadRequestError('Карточка с указанным _id не найдена.'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки.'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки.'));
      } else {
        next(err);
      }
    });
};
