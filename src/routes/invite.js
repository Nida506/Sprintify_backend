const express = require("express");
const router = express.Router();
const Invitation = require("../models/Invitation");
const nodemailer = require("nodemailer");

router.post("/send-invite", async (req, res) => {
  const { email, boardId, invitedBy } = req.body;

  try {
    // Store invitation
    const invitation = new Invitation({ email, boardId, invitedBy });
    await invitation.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const signupLink = `https://sprintify-htho.vercel.app/signup?email=${encodeURIComponent(email)}&boardId=${boardId}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You're invited to join a board",
      html: `
        <p>You’ve been invited to join a board on Sprintify App.</p>
        <p><a href="${signupLink}">Click here to sign up and join</a></p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Invitation sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send invite" });
  }
});

module.exports = router;
