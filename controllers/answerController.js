const Answer = require('../models/Answer');
const Doubt = require('../models/Doubt');
const { awardPointsAndCheckBadges } = require('utils/gamification');

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

    if (doubt.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator of the doubt can mark the best answer' });
    }

    if (answer.isBestAnswer) {
      return res.status(400).json({ message: 'Answer is already marked as best' });
    }

    answer.isBestAnswer = true;
    await answer.save();

    doubt.status = 'resolved';
    await doubt.save();

    await awardPointsAndCheckBadges(answer.user, 10);

    res.json({ message: 'Answer marked as best and doubt resolved', answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const voteOnAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user._id;

    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    if (voteType === 'upvote') {
      if (answer.upvotes.includes(userId)) {
        answer.upvotes.pull(userId); // untoggle
      } else {
        answer.upvotes.push(userId);
        answer.downvotes.pull(userId); // mutually exclusive
      }
    } else if (voteType === 'downvote') {
      if (answer.downvotes.includes(userId)) {
        answer.downvotes.pull(userId); // untoggle
      } else {
        answer.downvotes.push(userId);
        answer.upvotes.pull(userId); // mutually exclusive
      }
    } else {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = { createAnswer, markBestAnswer, voteOnAnswer };
