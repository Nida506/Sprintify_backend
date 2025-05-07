const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { Chat } = require('../models/chat');
const chatRouter = express.Router();
const moongoose = require('mongoose');
const { sendMessage, getBoardChats } = require('../controllers/chatController');
const { ObjectId } = moongoose.Types;

// ROUTE TO GET THE CHAT OF ONE CONTACT
chatRouter.post('/chat/sendMessage', userAuth, sendMessage);
chatRouter.get('/chat/getPreviousChat/:boardId', userAuth, getBoardChats);

module.exports = chatRouter;
