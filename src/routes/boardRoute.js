const express = require('express');
const router = express.Router();

const {
  createBoard,
  getBoard,
  getAllUsersBoards,
  updateBoard,
  deleteBoard,
  addNewListToBoard,
} = require('../controllers/boardController');

console.log({
  createBoard,
  getBoard,
  getAllUsersBoards,
  updateBoard,
  deleteBoard,
});

const { userAuth } = require('../middlewares/auth');
console.log(userAuth);

router.get('/getallboards', userAuth, getAllUsersBoards);
router.get('/:board_id', userAuth, getBoard);
router.post('/createboard', userAuth, createBoard);
router.post('/board/addNewList', userAuth, addNewListToBoard);
router.patch('/', userAuth, updateBoard);
router.delete('/', userAuth, deleteBoard);

module.exports = router;
