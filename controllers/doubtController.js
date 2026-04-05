const Doubt = require('../models/Doubt');

const createDoubt = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrls = [];

    // Extract Cloudinary URLs from multer array
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }

    const doubt = await Doubt.create({
      user: req.user._id,
      title,
      description,
      imageUrls,
    });

    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoubts = async (req, res) => {
  try {
    // Populate user name, role, points, and badges (simulating a basic profile)
    const doubts = await Doubt.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name role points badges');

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('user', 'name role points badges')
      .populate('answers');

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDoubt, getDoubts, getDoubtById };
