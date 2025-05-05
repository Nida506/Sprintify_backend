const mongoose = require('mongoose');

const cardSchema = mongoose.Schema(
  {
    description: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
      // required: true,
    },
    list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'list',
      required: true,
    },
    board_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'board',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const Card = mongoose.model('card', cardSchema);

module.exports = { Card };
