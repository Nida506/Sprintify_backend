const express = require('express');
const chatRouter = express.Router();

const { sendMessage, getBoardChats } = require('../controllers/chatController');
const { userAuth } = require('../middlewares/auth');
const multer = require('multer');

// Setup multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for sending message (with optional image)

chatRouter.post('/sendMessage', userAuth, upload.single('image'), sendMessage);
chatRouter.get('/chat/getPreviousChat/:boardId', userAuth, getBoardChats);
// GET route for fetching previous chat (no upload needed)

module.exports = chatRouter;
