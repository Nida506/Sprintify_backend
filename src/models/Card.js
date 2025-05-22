// const mongoose = require('mongoose');

// const cardSchema = mongoose.Schema(
//   {
//     description: {
//       type: String,
//       default: '',
//     },
//     position: {
//       type: Number,
//       // required: true,
//     },
//     list_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'list',
//       required: true,
//     },
//     board_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'board',
//       required: true,
//     },
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'user',
//       required: true,
//       select: false,
//     },
//   },
//   {
//     versionKey: false,
//   }
// );

// const Card = mongoose.model('card', cardSchema);

// module.exports = { Card };


const mongoose = require('mongoose');

const cardSchema = mongoose.Schema(
  {
    description: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
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

    // ✅ New Fields (Optional)
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],

    comments: [
      {
       
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    attachments: [
      {
        name: String,
        url: String,
        type: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    startDate: Date,
    dueDate: Date,
  },
  {
    versionKey: false,
  }
);

const Card = mongoose.model('card', cardSchema);
module.exports = { Card };

