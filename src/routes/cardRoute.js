const express = require('express');
const cardRouter = express.Router();

// const {
//   createCard,
//   getCard,
//   updateCardNameDes,
//   updateCardPositionList,
//   deleteCard,
// } = require('../controllers/card.controller');
// const { authenticate } = require('../middlewares/authenticate');
const { userAuth } = require('../middlewares/auth');
const { addNewCardToList } = require('../controllers/cardController');

// router.get('/:card_id', authenticate, getCard);
// router.post('/create', authenticate, createCard);
// router.patch('/name_des/:card_id', authenticate, updateCardNameDes);
// router.patch('/position_list/:card_id', authenticate, updateCardPositionList);
// router.delete('/', authenticate, deleteCard);

//========MOVE CARDS
cardRouter.patch('/board/addNewCard', userAuth, addNewCardToList);

module.exports = cardRouter;
