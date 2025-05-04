const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "accepted"], default: "pending" }
});

module.exports = mongoose.model("Invitation", invitationSchema);
