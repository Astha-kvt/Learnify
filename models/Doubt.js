const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String],
    default: [],
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  }],
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open',
  },
}, { timestamps: true });

module.exports = mongoose.model('Doubt', doubtSchema);
