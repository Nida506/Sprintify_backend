const { Chat } = require('../models/chat');
const { Board } = require('../models/Board');
const { io } = require('../libs/socket');
const cloudinary = require('../libs/cloudinary');

const sendMessage = async (req, res) => {
  const { userId, board_id, msgText, imageUrl: msg_Image } = req.body;

  try {
    if (!userId || !board_id || (!msgText && !msg_Image)) {
      return res.status(400).json('Invalid Data');
    }

    // Upload image to Cloudinary if exists
    let image_url = '';
    if (msg_Image) {
      const uploadResponse = await cloudinary.uploader.upload(msg_Image);
      image_url = uploadResponse.secure_url;
    }

    // Use board_id as roomId
    const roomId = board_id;

    // Get the board to access members
    const board = await Board.findById(board_id);
    if (!board) return res.status(404).json('Board not found');

    // Check if sender is a board member
    // Check if sender is a board member or owner

    const isMember =
      board.ownerId?.toString() === userId?.toString() ||
      board.members?.map((m) => m?.toString()).includes(userId?.toString());

    if (!isMember)
      return res
        .status(403)
        .json('User is not authorized to send messages to this board');

    // Find existing chat or create a new one with board members
    let chat = await Chat.findOne({ roomId });

    if (!chat) {
      chat = new Chat({
        participants: board.members,
        messages: [],
        roomId,
      });
      await chat.save();
    }

    // Push the new message
    chat.messages.push({
      senderId: userId,
      text: msgText,
      imageURL: image_url,
      timestamp: new Date(),
    });

    await chat.save();

    // Populate for response
    const populatedChat = await Chat.findById(chat._id)
      .populate('messages.senderId', 'firstName lastName photoUrl')
      .populate('participants', 'firstName lastName photoUrl');

    // Prepare message
    const newMsg = populatedChat.messages[populatedChat.messages.length - 1];
    const savedMessage = {
      roomId,
      text: newMsg.text,
      senderId: newMsg.senderId,
      imageURL: newMsg.imageURL,
      timestamp: newMsg.createdAt,
    };

    io.to(board_id).emit('messageReceived', savedMessage);

    res.status(200).json({
      message: 'Message send successfully',
      chatMessage: savedMessage,
    });
  } catch (error) {
    console.error('Error in message handling:', error);
  }
};

module.exports = { sendMessage };
