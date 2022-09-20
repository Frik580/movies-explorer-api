const Card = require('../models/card');
const { BadRequest } = require('../errors/badrequest');
const { Forbidden } = require('../errors/forbidden');
const { NotFound } = require('../errors/notfound');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne(card)
          .then(() => res.status(200).send(card))
          .catch(next);
      } else {
        throw new Forbidden();
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    {
      new: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Передан несуществующий id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    {
      new: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Передан несуществующий id карточки');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard, deleteCard, getAllCards, likeCard, dislikeCard,
};
