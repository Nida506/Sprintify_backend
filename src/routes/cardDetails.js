// // routes/cardRoutes.js
// const express = require('express');
// const multer = require('multer');
// const Card = require("../models/Card")
// const router = express.Router();

// // Multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Description
// router.post('/update-description', async (req, res) => {
//   const { cardId, description } = req.body;
//   console.log(Card)
//   await Card.findByIdAndUpdate(cardId, { description });
//   res.sendStatus(200);
// });

// // Add Comment
// router.post('/add-comment', async (req, res) => {
//   const { cardId, comment } = req.body;
//   await Card.findByIdAndUpdate(cardId, { $push: { activity: comment } });
//   res.sendStatus(200);
// });

// // Update Members
// router.post('/update-members', async (req, res) => {
//   const { cardId, members } = req.body;
//   await Card.findByIdAndUpdate(cardId, { members });
//   res.sendStatus(200);
// });

// // Update Dates
// router.post('/update-dates', async (req, res) => {
//   const { cardId, startDate, dueDate } = req.body;
//   await Card.findByIdAndUpdate(cardId, { startDate, dueDate });
//   res.sendStatus(200);
// });

// // Upload Attachments
// router.post('/upload-attachments', upload.array('files'), async (req, res) => {
//   const fileNames = req.files.map(file => file.filename); // store only filename
//   const cardId = req.body.cardId;
//   await Card.findByIdAndUpdate(cardId, { $push: { attachments: { $each: fileNames } } });
//   res.json(fileNames);
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ✅ Added to delete files from the server

const { Card } = require('../models/Card');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Helper function
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Description
router.put("/:cardId/update-description", async (req, res) => {
  const { cardId } = req.params;
  const { description } = req.body;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { description: description || "" },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json({ message: "Description updated successfully", card: updatedCard });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update Members
router.put("/:cardId/update-members", async (req, res) => {
  const { cardId } = req.params;
  const { members } = req.body;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    card.members = members;

    await card.save();

    res.json({ message: "Members updated successfully", members: card.members });
  } catch (error) {
    console.error("Error updating members:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Dates
router.put("/:cardId/update-dates", async (req, res) => {
  const { cardId } = req.params;
  const { startDate, dueDate } = req.body;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    card.startDate = startDate;
    card.dueDate = dueDate;

    await card.save();

    res.json({ message: "Dates updated successfully", card });
  } catch (error) {
    console.error("Error updating dates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 1) Get card details by id 
router.get("/:cardId", async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json({
      description: card.description,
      activity:  card.comments,
      isJoined: card.isJoined,
      members: card.members,
      startDate: card.startDate,
      dueDate: card.dueDate,
      attachments: card.attachments,
    });
  } catch (error) {
    console.error("Failed to fetch card data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2) Update card details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid card ID' });

    const {
      description,
      members,
      startDate,
      dueDate,
    } = req.body;

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (members !== undefined) updateData.members = members;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updatedCard = await Card.findByIdAndUpdate(id, updateData, { new: true })
      .populate('members', 'name email')
      .populate('comments.user_id', 'name email');

    if (!updatedCard) return res.status(404).json({ message: 'Card not found' });

    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3) Add a comment to card

router.put('/:cardId/comments', async (req, res) => {
  const { cardId } = req.params;
  const { activity } = req.body;

  console.log('received activity  ',activity)

  if (!Array.isArray(activity) || activity.length === 0) {
    return res.status(400).json({ error: 'Activity must be a non-empty array of comments' });
  }

  try {
    const newComments = activity.map((text) => ({
      comment: text,
      createdAt: new Date(),
    }));

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Append new comments to existing ones
    card.comments.push(...newComments);
    await card.save();

    res.status(200).json({
      message: 'Comments added successfully',
      comments: card.comments,
    });
  } catch (err) {
    console.error('Failed to update comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// 4) Delete comment by comment id
router.delete("/:cardId/comments/:commentId", async (req, res) => {
  const { cardId, commentId } = req.params;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Ensure comments is an array
    card.comments = (card.comments || []).filter(
      (comment) => comment._id.toString() !== commentId
    );

    await card.save();

    res.json({ message: "Comment deleted successfully", comments: card.comments });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// 5) Upload file attachments to card
router.put("/:cardId/attachments", async (req, res) => {
  const { cardId } = req.params;
  const { attachments } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Append new attachments to existing ones
    card.attachments = [...card.attachments, ...attachments];

    await card.save();

    res.json({ message: "Attachments updated successfully", attachments: card.attachments });
  } catch (error) {
    console.error("Error updating attachments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6) Delete attachment by id (also delete file from disk)
router.put("/:cardId/attachments/:attachmentId", async (req, res) => {
  const { cardId, attachmentId } = req.params;
  const { attachments } = req.body;  // updated attachments array

  try {
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ error: "Card not found" });

    // Option 1: Use attachments array sent by frontend to replace card.attachments:
    card.attachments = attachments;

    // Option 2 (optional): Remove attachment by attachmentId if you want to be sure
    // card.attachments = card.attachments.filter(att => att.id !== attachmentId);

    await card.save();

    res.json({ message: "Attachment removed and updated successfully!", attachments: card.attachments });
  } catch (error) {
    console.error("Error updating attachments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
