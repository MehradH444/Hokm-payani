const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtp, loginAsGuest } = require('./authController');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/guest-login', loginAsGuest);

module.exports = router;
