const User = require('./User');
const Tournament = require('./Tournament');
const Clan = require('./Clan');

// ۱. دریافت جدول رده‌بندی بر اساس بردها و امتیازات
exports.getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await User.find({})
      .select('displayName avatar level xp stats isVIP')
      .sort({ 'stats.wins': -1, xp: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      leaderboard: topPlayers
    });
  } catch (error) {
    console.error('[Get Leaderboard Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در دریافت جدول رده‌بندی.' });
  }
};

// ۲. دریافت لیست تورنمنت‌های فعال
exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({}).sort({ startDate: 1 });
    return res.status(200).json({
      success: true,
      tournaments
    });
  } catch (error) {
    console.error('[Get Tournaments Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در دریافت تورنمنت‌ها.' });
  }
};

// ۳. ثبت‌نام در تورنمنت
exports.registerTournament = async (req, res) => {
  try {
    const { tournamentId } = req.body;
    const tournament = await Tournament.findById(tournamentId);
    const user = await User.findById(req.user._id);

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'تورنمنت یافت نشد.' });
    }

    if (tournament.participants.length >= tournament.capacity) {
      return res.status(400).json({ success: false, message: 'ظرفیت این تورنمنت تکمیل شده است.' });
    }

    if (tournament.participants.includes(user._id)) {
      return res.status(400).json({ success: false, message: 'شما قبلاً در این تورنمنت ثبت‌نام کرده‌اید.' });
    }

    if (user.coins < tournament.entryFee) {
      return res.status(400).json({ success: false, message: 'موجودی سکه شما برای ورودی کافی نیست.' });
    }

    user.coins -= tournament.entryFee;
    tournament.participants.push(user._id);

    await user.save();
    await tournament.save();

    return res.status(200).json({
      success: true,
      message: 'ثبت‌نام در تورنمنت با موفقیت انجام شد.',
      tournament
    });
  } catch (error) {
    console.error('[Register Tournament Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در ثبت‌نام تورنمنت.' });
  }
};

// ۴. ایجاد اتحاد جدید
exports.createClan = async (req, res) => {
  try {
    const { name, description, badgeIcon, isPrivate, minLevel } = req.body;
    const user = await User.findById(req.user._id);

    const existingClan = await Clan.findOne({ name });
    if (existingClan) {
      return res.status(400).json({ success: false, message: 'اتحادی با این نام قبلاً ساخته شده است.' });
    }

    const clan = await Clan.create({
      name,
      description,
      badgeIcon,
      isPrivate,
      minLevel,
      leader: user._id,
      members: [{ user: user._id, role: 'LEADER' }]
    });

    return res.status(201).json({
      success: true,
      message: 'اتحاد با موفقیت ساخته شد.',
      clan
    });
  } catch (error) {
    console.error('[Create Clan Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در ساخت اتحاد.' });
  }
};

// ۵. ارسال پیام در چت گروهی اتحاد
exports.sendClanMessage = async (req, res) => {
  try {
    const { clanId, text } = req.body;
    const clan = await Clan.findById(clanId);

    if (!clan) {
      return res.status(404).json({ success: false, message: 'اتحاد یافت نشد.' });
    }

    const isMember = clan.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'شما عضو این اتحاد نیستید.' });
    }

    clan.messages.push({
      sender: req.user._id,
      text
    });

    await clan.save();

    return res.status(200).json({
      success: true,
      message: 'پیام ارسال شد.',
      messages: clan.messages
    });
  } catch (error) {
    console.error('[Send Clan Message Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در ارسال پیام.' });
  }
};
