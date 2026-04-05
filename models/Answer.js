const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doubt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isBestAnswer: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);
