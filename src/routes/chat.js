const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { Chat } = require('../models/chat');
const chatRouter = express.Router();
const moongoose = require('mongoose');
const { sendMessage } = require('../controllers/chatController');
const { ObjectId } = moongoose.Types;

// ROUTE TO GET THE CHAT OF ONE CONTACT
chatRouter.post('/chat/sendMessage', userAuth, sendMessage);

module.exports = chatRouter;
