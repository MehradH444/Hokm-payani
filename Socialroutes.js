const express = require('express');
const router = express.Router();
const { protect } = require('./authMiddleware');
const {
  getLeaderboard,
  getTournaments,
  registerTournament,
  createClan,
  sendClanMessage
} = require('./socialController');

// روت‌های عمومی و اجتماعی
router.get('/leaderboard', protect, getLeaderboard);
router.get('/tournaments', protect, getTournaments);
router.post('/tournaments/register', protect, registerTournament);
router.post('/clan/create', protect, createClan);
router.post('/clan/chat', protect, sendClanMessage);

module.exports = router;
