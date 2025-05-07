const { List } = require('../models/List');
const { Card } = require('../models/Card');
const { errorTemplate } = require('../utils/errorTemplate');

const mongodb = require('mongodb');

const { Board } = require('../models/Board');

const mongoose = require('mongoose');
const { io } = require('../libs/socket');
const { ObjectId } = mongoose.Types;

const getCard = async (req, res) => {
  let { card_id } = req.params;
  try {
    let card = await Card.findOne({ _id: card_id }).lean().exec();

    if (!card) {
      return errorTemplate(res, 400, 'Invalid card id');
    }

    return res.status(200).json({
      error: false,
      data: {
        card,
      },
    });
  } catch (error) {
    return errorTemplate(res, 400, error.message);
  }
};

const updateCardNameDes = async (req, res) => {
  let { card_id } = req.params;

  try {
    const card = await Card.findOneAndUpdate({ _id: card_id }, req.body, {
      new: true,
    })
      .lean()
      .exec();

    return res.status(200).json({
      error: false,
      data: {
        card,
      },
    });
  } catch (error) {
    return errorTemplate(res, 400, error.message);
  }
};

const updateCardPositionList = async (req, res) => {
  let { card_id } = req.params;
  let { prev_position, next_position, list_id } = req.body;

  try {
    let position =
      prev_position === undefined && next_position === undefined
        ? 1
        : prev_position === undefined
        ? getFirst(next_position)
        : next_position === undefined
        ? getLast(prev_position)
        : getMean(prev_position, next_position);

    let payload = { position, list_id };
    let card = await Card.findOneAndUpdate({ _id: card_id }, payload, {
      new: true,
    })
      .lean()
      .exec();

    return res.status(200).json({
      error: false,
      data: {
        card,
      },
    });
  } catch (error) {
    return errorTemplate(res, 400, error.message);
  }
};

const deleteCard = async (req, res) => {
  let { card_id } = req.body;

  try {
    await Card.findOneAndDelete({ _id: card_id }).lean().exec();

    return res.status(200).json({
      error: false,
      message: 'Card deleted successfully',
    });
  } catch (error) {
    return errorTemplate(res, 400, error.message);
  }
};

const addNewCardToList = async (req, res) => {
  let { list_id, description, board_id = 'default text' } = req.body;
  const user_id = req.user?._id;

  if (!list_id) {
    return res.status(500).json({ message: 'Missing list_id or card name' });
  }

  try {
    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(list_id)) {
      return res.status(400).json({ error: true, message: 'Invalid list_id' });
    }

    // ✅ Fetch the list
    const list = await List.findById(list_id);
    if (!list) {
      return res.status(404).json({ error: true, message: 'List not found' });
    }

    // ✅ Determine the position of the new card
    const position = list.cards.length;

    // ✅ Create the new card
    const newCard = await Card.create({
      description: description.trim(),
      position,
      list_id,
      board_id: list.board_id,
      user_id,
    });

    // ✅ Add card to the list
    list.cards.push(newCard._id);
    await list.save();

    return res.status(200).json({
      message: 'Card added successfully',
      card: newCard,
      list_id: list._id,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};


module.exports = {
  // getCard,
  // updateCardNameDes,
  // updateCardPositionList,
  addNewCardToList,
  // deleteCard,
};
