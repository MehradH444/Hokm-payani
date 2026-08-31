const User = require('./User');

// ۱. دریافت اطلاعات کامل پروفایل کاربر جاری
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[Get Profile Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در دریافت پروفایل.' });
  }
};

// ۲. دریافت جایزه ورود روزانه (Daily Reward Streak)[span_1](start_span)[span_1](end_span)
exports.claimDailyReward = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const now = new Date();
    const lastLogin = new Date(user.lastLoginDate);
    
    // بررسی اینکه آیا از آخرین دریافت بیش از ۲۴ ساعت گذشته است
    const hoursDifference = Math.abs(now - lastLogin) / 36e5;

    if (hoursDifference < 24 && user.dailyRewardStreak > 0) {
      return res.status(400).json({
        success: false,
        message: 'جایزه امروز خود را قبلاً دریافت کرده‌اید. فردا دوباره سر بزنید!'
      });
    }

    // اگر بیش از ۴۸ ساعت گذشته باشد، زنجیره از ۱ شروع می‌شود
    if (hoursDifference > 48) {
      user.dailyRewardStreak = 1;
    } else {
      user.dailyRewardStreak = (user.dailyRewardStreak % 7) + 1;
    }

    // محاسبه مقدار سکه بر اساس روز (روز ۱: ۵۰۰ تا روز ۷: ۵۰۰۰ سکه)
    const rewardCoins = user.dailyRewardStreak * 500;
    user.coins += rewardCoins;
    user.lastLoginDate = now;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `جایزه روز ${user.dailyRewardStreak} با موفقیت دریافت شد!`,
      rewardCoins,
      coins: user.coins,
      dailyRewardStreak: user.dailyRewardStreak
    });
  } catch (error) {
    console.error('[Claim Daily Reward Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در دریافت جایزه روزانه.' });
  }
};

// ۳. دریافت سکه رایگان از طریق تماشای ویدیوی تبلیغاتی[span_2](start_span)[span_2](end_span)
exports.watchAdForReward = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const adRewardCoins = 500; // ۵۰۰ سکه به ازای هر ویدیو[span_3](start_span)[span_3](end_span)

    user.coins += adRewardCoins;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'ویدیو با موفقیت مشاهده شد. ۵۰۰ سکه به حساب شما اضافه شد!',
      rewardCoins: adRewardCoins,
      coins: user.coins
    });
  } catch (error) {
    console.error('[Watch Ad Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در واریز سکه تبلیغات.' });
  }
};

// ۴. ویرایش نام نمایشی و آواتار کاربر
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (displayName) {
      // تغییر نام سفارشی نیازمند اکانت VIP است[span_4](start_span)[span_4](end_span)
      if (user.displayName !== displayName && !user.isVIP) {
        return res.status(403).json({
          success: false,
          message: 'تغییر نام نمایشی فقط برای کاربران دارای اشتراک VIP امکان‌پذیر است.'
        });
      }
      user.displayName = displayName;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'پروفایل با موفقیت بروزرسانی شد.',
      user
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در بروزرسانی پروفایل.' });
  }
};
