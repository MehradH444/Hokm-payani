const express = require('express');
const router = express.Router();
const { protect } = require('./authMiddleware');
const { getProfile, claimDailyReward, watchAdForReward, updateProfile } = require('./userController');
const { getStoreItems, buyItem, equipItem } = require('./storeController');

// روت‌های پروفایل
router.get('/profile', protect, getProfile);
router.post('/claim-daily-reward', protect, claimDailyReward);
router.post('/watch-ad', protect, watchAdForReward);
router.put('/update-profile', protect, updateProfile);

// روت‌های فروشگاه
router.get('/store/items', protect, getStoreItems);
router.post('/store/buy', protect, buyItem);
router.post('/store/equip', protect, equipItem);

module.exports = router;
