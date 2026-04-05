const User = require('../models/User');
const Doubt = require('../models/Doubt');
const Answer = require('../models/Answer');

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(10).select('-password -email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor' }).select('-password');
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const doubts = await Doubt.find({ user: user._id }).sort({ createdAt: -1 });
    const answers = await Answer.find({ user: user._id })
      .populate('doubt', 'title status')
      .sort({ createdAt: -1 });

    res.json({ user, doubts, answers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard, getTutors, getUserProfile };
