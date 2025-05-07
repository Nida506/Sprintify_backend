const express = require("express");
const router = express.Router();
const { List } = require("../models/List");
const { Card } = require("../models/Card");
const { userAuth } = require("../middlewares/auth");

// Update list name
router.patch("/listName", userAuth, async (req, res) => {
  console.log(1);
  const { list_id, name } = req.body;

  if (!list_id || !name) {
    return res
      .status(400)
      .json({ error: true, message: "Missing list_id or name" });
  }

  try {
    const updatedList = await List.findOneAndUpdate(
      { _id: list_id },
      { name },
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedList) {
      return res.status(404).json({ error: true, message: "List not found" });
    }

    return res.status(200).json({ error: false, data: { list: updatedList } });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
});

// Delete list
router.delete("/deleteList", userAuth, async (req, res) => {
  const { list_id } = req.body;

  if (!list_id) {
    return res.status(400).json({ error: true, message: "Missing list_id" });
  }

  try {
    await List.findOneAndDelete({ _id: list_id }).lean().exec();
    await Card.deleteMany({ list_id }).lean().exec();

    return res
      .status(200)
      .json({ error: false, message: "List deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: true, message: err.message });
  }
});

// update the position

// Example for Express + Mongoose
router.patch("/update-list-order", async (req, res) => {
  try {
    const { board_id, orderedListIds } = req.body;

    if (!board_id || !Array.isArray(orderedListIds)) {
      return res.status(400).json({ error: true, message: "Invalid data" });
    }

    // Loop through and update each list's position
    await Promise.all(
      orderedListIds.map((listId, index) =>
        List.findByIdAndUpdate(listId, { position: index })
      )
    );

    res.json({ error: false, message: "List order updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

module.exports = router;
