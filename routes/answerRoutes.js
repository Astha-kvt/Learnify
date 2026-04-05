const express = require('express');
const router = express.Router();
const { createAnswer, markBestAnswer, voteOnAnswer } = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/doubts/:doubtId/answers', protect, createAnswer);
router.put('/answers/:answerId/best', protect, markBestAnswer);
router.put('/answers/:answerId/vote', protect, voteOnAnswer);

module.exports = router;
