const express = require("express");
const router = express.Router();

const {
  createBoard,
  getBoard,
  getAllUsersBoards,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

console.log({ createBoard, getBoard, getAllUsersBoards, updateBoard, deleteBoard });

const { userAuth } = require("../middlewares/auth");
console.log(userAuth);

router.get("/user", userAuth, getAllUsersBoards);
router.get("/:board_id", userAuth, getBoard);
router.post("/", userAuth, createBoard);
router.patch("/", userAuth, updateBoard);
router.delete("/", userAuth, deleteBoard);

module.exports = router;