const express = require('express');
const router = express.Router();
const Invitation = require('../models/Invitation');
const nodemailer = require('nodemailer');

const { Board } = require('../models/Board'); // Make sure Board model is imported
const { User } = require('../models/user'); // Import User model to find user by email

router.post('/send-invite', async (req, res) => {
  const { email, boardId, invitedBy } = req.body;

  try {
    // Store invitation
    const invitation = new Invitation({ email, boardId, invitedBy });
    await invitation.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const signupLink = `https://sprintify-htho.vercel.app`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You're invited to join a board",
      html: `
        <p>You’ve been invited to join a board on Sprintify App.</p>
        <p><a href="${signupLink}">Click here to sign up or login and join</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Check if the invited email belongs to an existing user
    const user = await User.findOne({ emailId: email });

    if (user) {
      // Add user to board members if not already in
      const board = await Board.findById(boardId);
      if (board && !board.members.includes(user._id)) {
        board.members.push(user._id);
        await board.save();
      }
    }

    res
      .status(200)
      .json({ message: 'Invitation sent and member added (if user exists)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send invite' });
  }
});

module.exports = router;
