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

const { userAuth } = require('../middlewares/auth');

router.get('/getallboards', userAuth, getAllUsersBoards);
router.get('/:board_id', userAuth, getBoard);
router.post('/createboard', userAuth, createBoard);
router.post('/board/addNewList', userAuth, addNewListToBoard);

// router.patch('/', userAuth, updateBoard);
// router.delete('/', userAuth, deleteBoard);

module.exports = router;
