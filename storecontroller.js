const StoreItem = require('./StoreItem');
const User = require('./User');

// ۱. دریافت لیست تمام آیتم‌های فروشگاه به تفکیک دسته‌بندی
exports.getStoreItems = async (req, res) => {
  try {
    const items = await StoreItem.find({});
    return res.status(200).json({
      success: true,
      items
    });
  } catch (error) {
    console.error('[Get Store Items Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در دریافت آیتم‌های فروشگاه.' });
  }
};

// ۲. خرید آیتم درون‌برنامه‌ای با سکه/الماس یا شبیه‌سازی پرداخت تومان
exports.buyItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await StoreItem.findById(itemId);
    const user = await User.findById(req.user._id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'آیتم مورد نظر یافت نشد.' });
    }

    // خرید با سکه
    if (item.priceCurrency === 'COIN') {
      if (user.coins < item.priceAmount) {
        return res.status(400).json({ success: false, message: 'موجودی سکه شما کافی نیست.' });
      }
      user.coins -= item.priceAmount;
    }

    // اعمال تغییرات آیتم خریداری شده
    if (item.type === 'AVATAR') {
      if (!user.inventory.avatars.includes(item.assetIdentifier)) {
        user.inventory.avatars.push(item.assetIdentifier);
      }
    } else if (item.type === 'CARD_BACK') {
      if (!user.inventory.cardBacks.includes(item.assetIdentifier)) {
        user.inventory.cardBacks.push(item.assetIdentifier);
      }
    } else if (item.type === 'TABLE_SKIN') {
      if (!user.inventory.tableSkins.includes(item.assetIdentifier)) {
        user.inventory.tableSkins.push(item.assetIdentifier);
      }
    } else if (item.type === 'VIP') {
      user.isVIP = true;
      const now = new Date();
      const currentExpire = user.vipExpiresAt && user.vipExpiresAt > now ? user.vipExpiresAt : now;
      user.vipExpiresAt = new Date(currentExpire.getTime() + item.valueAmount * 24 * 60 * 60 * 1000);
    } else if (item.type === 'COINS') {
      user.coins += item.valueAmount;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'خرید با موفقیت انجام شد.',
      user
    });
  } catch (error) {
    console.error('[Buy Item Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در فرآیند خرید.' });
  }
};

// ۳. تجهیز طرح کارت یا تم میز انتخاب‌شده[span_7](start_span)[span_7](end_span)
exports.equipItem = async (req, res) => {
  try {
    const { itemType, assetIdentifier } = req.body;
    const user = await User.findById(req.user._id);

    if (itemType === 'CARD_BACK') {
      if (!user.inventory.cardBacks.includes(assetIdentifier) && assetIdentifier !== 'classic') {
        return res.status(400).json({ success: false, message: 'شما این طرح کارت را در اختیار ندارید.' });
      }
      user.equippedCardBack = assetIdentifier;
    } else if (itemType === 'TABLE_SKIN') {
      if (!user.inventory.tableSkins.includes(assetIdentifier) && assetIdentifier !== 'classic_green') {
        return res.status(400).json({ success: false, message: 'شما این تم میز را در اختیار ندارید.' });
      }
      user.equippedTableSkin = assetIdentifier;
    } else {
      return res.status(400).json({ success: false, message: 'نوع آیتم نامعتبر است.' });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'آیتم با موفقیت فعال شد.',
      equippedCardBack: user.equippedCardBack,
      equippedTableSkin: user.equippedTableSkin
    });
  } catch (error) {
    console.error('[Equip Item Error]:', error);
    return res.status(500).json({ success: false, message: 'خطای سرور در فعال‌سازی آیتم.' });
  }
};
