const mongoose = require('mongoose');

const boardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bgColor: {
      type: String,
      default: '#ffffff',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      select: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'list',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Board = mongoose.model('board', boardSchema);

module.exports = { Board };
