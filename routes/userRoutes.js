const express = require('express');
const router = express.Router();
const { getLeaderboard, getTutors, getUserProfile } = require('../controllers/userController');

router.get('/leaderboard', getLeaderboard);
router.get('/tutors', getTutors);
router.get('/:id/profile', getUserProfile);

module.exports = router;
