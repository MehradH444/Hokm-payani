const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['COINS', 'VIP', 'AVATAR', 'CARD_BACK', 'TABLE_SKIN'],
    required: true
  },
  priceAmount: {
    type: Number,
    required: true
  },
  priceCurrency: {
    type: String,
    enum: ['IRR', 'COIN', 'GEM'],
    default: 'IRR'
  },
  valueAmount: {
    type: Number,
    default: 0 // مقدار سکه اعطایی یا تعداد روزهای VIP
  },
  assetIdentifier: {
    type: String,
    default: '' // نام فایل آواتار یا اسکین کارت
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  discountPercent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StoreItem', storeItemSchema);
