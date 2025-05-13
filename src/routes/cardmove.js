const express = require('express');
const router = express.Router();
const { Card } = require('../models/Card');

// Update card position after drag & drop
router.post('/update-position', async (req, res) => {
  try {
    const {
      cardId,
      sourceListId,
      destinationListId,
      sourceIndex,
      destinationIndex,
    } = req.body;

    console.log('Received payload:', req.body);

    if (!cardId || !sourceListId || !destinationListId || sourceIndex === undefined || destinationIndex === undefined) {
      return res.status(400).json({ message: 'Missing required fields in request body' });
    }

    if (sourceListId === destinationListId) {
      let cards = await Card.find({ list_id: sourceListId }).sort({ position: 1 });
    
      const actualSourceIndex = cards.findIndex(c => c._id.toString() === cardId);
      if (
        actualSourceIndex === -1 ||
        destinationIndex < 0 ||
        destinationIndex > cards.length
      ) {
        return res.status(400).json({ message: 'Invalid index values or card not found' });
      }
    
      const [movedCard] = cards.splice(actualSourceIndex, 1);
      cards.splice(destinationIndex, 0, movedCard);
    
      await Promise.all(cards.map((card, index) => {
        card.position = index;
        return card.save();
      }));
    
      console.log('Cards after move (same list):', cards.map(c => ({ id: c._id, pos: c.position })));
    }
     else {
      // Move to a different list
      let sourceCards = await Card.find({ list_id: sourceListId }).sort({ position: 1 });
      let destCards = await Card.find({ list_id: destinationListId }).sort({ position: 1 });

      console.log('Before move - sourceCards:', sourceCards.map(c => ({ id: c._id, pos: c.position })));
      console.log('Before move - destCards:', destCards.map(c => ({ id: c._id, pos: c.position })));

      if (
        sourceIndex < 0 || sourceIndex >= sourceCards.length ||
        destinationIndex < 0 || destinationIndex > destCards.length
      ) {
        return res.status(400).json({ message: 'Invalid index values' });
      }

      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      movedCard.list_id = destinationListId;
      destCards.splice(destinationIndex, 0, movedCard);

      // Save updated positions in source list
      for (let i = 0; i < sourceCards.length; i++) {
        sourceCards[i].position = i;
        await sourceCards[i].save();
      }

      // Save updated positions in destination list
      for (let i = 0; i < destCards.length; i++) {
        destCards[i].position = i;
        await destCards[i].save();
      }

      await movedCard.save();

      console.log('After move - destCards:', destCards.map(c => ({ id: c._id, pos: c.position })));
    }

    res.status(200).json({ message: 'Card position updated successfully' });
  } catch (err) {
    console.error('Position update failed:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;  