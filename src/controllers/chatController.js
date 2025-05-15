const { Chat } = require('../models/chat');
const { Board } = require('../models/Board');
const { io } = require('../libs/socket');
const cloudinary = require('../libs/cloudinary');

const sendMessage = async (req, res) => {
  try {
    console.log(req);
    const { userId, board_id, msgText } = req.body;
    console.log(userId, board_id, msgText);
    const file = req.file;
    console.log(file);

    if (!userId || !board_id || (!msgText && !file)) {
      return res.status(400).json('Invalid Data');
    }

    // Upload image to Cloudinary if a file is attached
    let image_url = '';
    if (file) {
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json('Image upload failed');
          }
          image_url = result.secure_url;
          continueMessage(); // Proceed with DB operations
        }
      );

      uploadResponse.end(file.buffer); // Pass the file buffer
    } else {
      continueMessage(); // No image, just proceed
    }

    async function continueMessage() {
      const board = await Board.findById(board_id);
      if (!board) return res.status(404).json('Board not found');

      const isMember =
        board.ownerId?.toString() === userId?.toString() ||
        board.members?.map((m) => m?.toString()).includes(userId?.toString());

      if (!isMember) {
        return res
          .status(403)
          .json('User is not authorized to send messages to this board');
      }

      const roomId = board_id;

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

      const populatedChat = await Chat.findById(chat._id)
        .populate('messages.senderId', 'firstName lastName photoUrl')
        .populate('participants', 'firstName lastName photoUrl');

      const newMsg = populatedChat.messages[populatedChat.messages.length - 1];
      const savedMessage = {
        roomId,
        text: newMsg.text,
        senderId: newMsg.senderId,
        imageURL: newMsg.imageURL,
        timestamp: newMsg.createdAt,
      };

      io.to(roomId).emit('messageReceived', savedMessage);

      console.log(savedMessage);
      res.status(200).json({
        message: 'Message sent successfully',
        chatMessage: savedMessage,
      });
    }
  } catch (error) {
    console.error('Error in message handling:', error);
    res.status(500).json('Internal server error');
  }
};

const getBoardChats = async (req, res) => {
  const { boardId } = req.params;
  let userId = req?.user?._id;

  console.log(userId);
  try {
    if (!boardId || !userId) {
      return res.status(400).json({ error: 'Missing boardId or userId' });
    }

    // Verify board exists
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ error: 'Board not found' });

    // Check if the user is a member or owner
    const isMember =
      board.ownerId?.toString() === userId?.toString() ||
      board.members?.map((m) => m?.toString()).includes(userId?.toString());

    if (!isMember) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to view messages' });
    }

    // Fetch chat by roomId
    const chat = await Chat.findOne({ roomId: boardId })
      .populate('messages.senderId', 'firstName lastName photoUrl')
      .populate('participants', 'firstName lastName photoUrl');

    if (!chat) {
      return res.status(200).json({ messages: [] }); // No messages yet
    }

    // Format messages
    const formattedMessages = chat.messages.map((msg) => ({
      roomId: boardId,
      text: msg.text,
      senderId: msg.senderId,
      imageURL: msg.imageURL,
      timestamp: msg.createdAt,
    }));

    res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
};

module.exports = { sendMessage, getBoardChats };
