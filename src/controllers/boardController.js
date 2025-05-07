const mongodb = require("mongodb");

const { Board } = require("../models/Board");
const { List } = require("../models/List");
const { Card } = require("../models/Card");
const mongoose = require("mongoose");
const { errorTemplate } = require("../utils/errorTemplate");
const { io } = require("../libs/socket");
const { ObjectId } = mongoose.Types;

const getBoard = async (req, res) => {
  const { board_id } = req.params;

  try {
    const board = await Board.findById(board_id)
      .populate({
        path: "lists",
        options: { sort: { position: 1 } },
        populate: {
          path: "cards",
          model: "card", // ✅ match the registered model name here
          options: { sort: { position: 1 } },
        },
      })
      .populate({
        path: "members",
        model: "User", // assuming your user model is registered as 'User'
        select: "-password", // hide sensitive data
      })
      .lean();

    if (board?.lists?.length) {
      board.lists.sort((a, b) => a.position - b.position);
    }

    if (!board) {
      return errorTemplate(res, 400, "Invalid board id");
    }

    return res.status(200).json({
      error: false,
      data: { board },
    });
  } catch (error) {
    return errorTemplate(res, 400, error.message);
  }
};

const getAllUsersBoards = async (req, res) => {
  let user_id = req.user._id;
  try {
    const boards = await Board.find({
      $or: [
        { ownerId: user_id },
        { members: { $in: [user_id] } }, // explicitly check for inclusion in array
      ],
    }).populate("lists");

    return res.status(200).json({
      message: "Boards fetched successfully!",
      boards,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createBoard = async (req, res) => {
  let { name, bgColor } = req.body;
  let user_id = req.user._id;
  let otherUserId = new ObjectId("681636dfd1b1631edc5fe9dd");
  try {
    let payload = {
      name,
      ownerId: user_id,
      bgColor: bgColor || "#ffffff",
      members: [otherUserId],
    };

    let board = await Board.create(payload);

    return res.status(200).json({
      message: "Board Created Successfully",
      data: {
        board,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addNewListToBoard = async (req, res) => {
  let { board_id, listName } = req.body;
  const user_id = req.user?._id;

  if (!board_id || !listName) {
    return res
      .status(500)
      .json({ error: true, message: "Missing board_id or listName" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(board_id)) {
      return res.status(500).json({ error: true, message: "Invalid board_id" });
    }

    const board = await Board.findById(board_id);
    if (!board) {
      return res.status(404).json({ error: true, message: "Board not found" });
    }

    // ✅ Determine position as the next index
    const position = board.lists.length;

    // ✅ Create the new list with position
    const newList = await List.create({
      name: listName,
      board_id,
      user_id,
      position,
    });

    // ✅ Add the new list's ID to the board's list array
    board.lists.push(newList._id);
    await board.save();

    io.to(board_id).emit("list-added", { newList, userId: req.user._id });

    return res.status(200).json({
      message: "List added successfully",
      board,
      newList: newList,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

const updateBoard = async (req, res) => {
  let { name, bgColor, board_id } = req.body;

  try {
    let payload = {
      name,
      ...(bgColor && { bgColor }),
    };

    let board = await Board.findOneAndUpdate({ _id: board_id }, payload, {
      new: true,
    })
      .lean()
      .exec();

    return res.status(200).json({
      error: false,
      data: {
        board,
      },
    });
  } catch (error) {
    return errorTemplate(res, 400, error.message);
  }
};

const deleteBoard = async (req, res) => {
  let { board_id } = req.body;

  try {
    await Board.findOneAndDelete({ _id: board_id }).lean().exec();
    await List.deleteMany({ board_id }).lean().exec();
    await Card.deleteMany({ board_id }).lean().exec();

    return res.status(200).json({
      error: false,
      message: "Board deleted successfully",
    });
  } catch (error) {
    return errorTemplate(res, 400, error.message);
  }
};

module.exports = {
  getBoard,
  getAllUsersBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  addNewListToBoard,
};
