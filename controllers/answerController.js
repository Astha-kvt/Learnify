const Answer = require('../models/Answer');
const Doubt = require('../models/Doubt');
const { awardPointsAndCheckBadges } = require('../utils/gamification');

const createAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    const { doubtId } = req.params;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    const answer = await Answer.create({
      user: req.user._id,
      doubt: doubtId,
      text,
    });

    // Push the answer reference to the existing Doubt array
    doubt.answers.push(answer._id);
    await doubt.save();

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markBestAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const doubt = await Doubt.findById(answer.doubt);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Authorization: Only the user who originally posted the Doubt can accept answers
    if (doubt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator of the doubt can mark the best answer' });
    }

    if (answer.isBestAnswer) {
      return res.status(400).json({ message: 'Answer is already marked as best' });
    }

    // Assign boolean flag
    answer.isBestAnswer = true;
    await answer.save();

    // Close the loop
    doubt.status = 'resolved';
    await doubt.save();

    // Award +10 Gamification Points and check for badge promotions
    await awardPointsAndCheckBadges(answer.user, 10);

    res.json({ message: 'Answer marked as best and doubt resolved', answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnswer, markBestAnswer };
