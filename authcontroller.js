const User = require('./User');
const Otp = require('./Otp');
const jwt = require('jsonwebtoken');

// ساخت توکن JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hokm_master_super_secret_jwt_key_2026_production', {
    expiresIn: '30d'
  });
};

// تولید کد ۶ رقمی تصادفی
const generateOtpCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// تولید کد معرف منحصر به فرد
const generateReferralCode = () => {
  return 'HOKM-' + Math.random().toString(36).substring(2, 7).toUpperCase();
};

// ۱. درخواست ارسال کد OTP
exports.requestOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !phoneNumber.match(/^(\+98|0)?9\d{9}$/)) {
      return res.status(400).json({ success: false, message: 'شماره همراه وارد شده معتبر نیست.' });
    }

    // پاکسازی کدهای قبلی این شماره
    await Otp.deleteMany({ phoneNumber });

    const code = generateOtpCode();
    await Otp.create({ phoneNumber, code });

    // در محیط واقعی، اینجا API کاوه‌نگار یا سامانه پیامک فراخوانی می‌شود
    console.log(`[SMS OTP] Code for ${phoneNumber} is: ${code}`);

    return res.status(200).json({
      success: true,
      message: 'کد تأیید با موفقیت ارسال شد.',
      // جهت تست راحت‌تر در محیط توسعه کد برگردانده می‌شود
      devCode: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    console.error('[Request OTP Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در ارسال کد تأیید.' });
  }
};

// ۲. تایید کد OTP و ورود/ثبت‌نام
exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, code, referralCode } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({ success: false, message: 'شماره همراه و کد تأیید الزامی است.' });
    }

    const otpRecord = await Otp.findOne({ phoneNumber, code });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'کد وارد شده اشتباه یا منقضی شده است.' });
    }

    // حذف کد مصرف شده
    await Otp.deleteOne({ _id: otpRecord._id });

    let user = await User.findOne({ phoneNumber });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      let refUser = null;

      if (referralCode) {
        refUser = await User.findOne({ referralCode });
      }

      user = await User.create({
        phoneNumber,
        displayName: `بازیکن_${Math.floor(1000 + Math.random() * 9000)}`,
        isGuest: false,
        referralCode: generateReferralCode(),
        referredBy: refUser ? refUser._id : null
      });

      // واریز پاداش ۵۰۰۰ سکه به معرف در صورت وجود[span_1](start_span)[span_1](end_span)
      if (refUser) {
        refUser.coins += 5000;
        await refUser.save();
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: isNewUser ? 'ثبت‌نام با موفقیت انجام شد.' : 'ورود با موفقیت انجام شد.',
      token,
      user
    });
  } catch (error) {
    console.error('[Verify OTP Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در بررسی کد تأیید.' });
  }
};

// ۳. ورود به‌عنوان مهمان[span_2](start_span)[span_2](end_span)
exports.loginAsGuest = async (req, res) => {
  try {
    const guestUser = await User.create({
      displayName: `مهمان_${Math.floor(10000 + Math.random() * 90000)}`,
      isGuest: true,
      coins: 1000,
      referralCode: generateReferralCode()
    });

    const token = generateToken(guestUser._id);

    return res.status(201).json({
      success: true,
      message: 'ورود مهمان با موفقیت انجام شد.',
      token,
      user: guestUser
    });
  } catch (error) {
    console.error('[Guest Login Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در ایجاد حساب مهمان.' });
  }
};
