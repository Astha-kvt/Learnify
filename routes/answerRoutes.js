const express = require('express');
const router = express.Router();
const { createAnswer, markBestAnswer } = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

// Note: These paths assume the router is mounted at '/api'.
// This avoids complex nested route parameter merging in Express 4.x
router.post('/doubts/:doubtId/answers', protect, createAnswer);
router.put('/answers/:answerId/best', protect, markBestAnswer);

module.exports = router;
