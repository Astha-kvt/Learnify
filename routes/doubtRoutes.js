const express = require('express');
const router = express.Router();
const { createDoubt, getDoubts, getDoubtById } = require('../controllers/doubtController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all doubts (Publicly viewable)
router.get('/', getDoubts);

// Get specific doubt by ID (Publicly viewable)
router.get('/:id', getDoubtById);

// Create a new doubt (Protected & Image Upload Supported)
// 'images' maps to the form-data key expected for uploading files
router.post('/', protect, upload.array('images', 5), createDoubt);

module.exports = router;
