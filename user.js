const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    default: 'بازیکن جدید'
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: 'default_avatar.png'
  },
  coins: {
    type: Number,
    default: 1000
  },
  gems: {
    type: Number,
    default: 10
  },
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  isVIP: {
    type: Boolean,
    default: false
  },
  vipExpiresAt: {
    type: Date,
    default: null
  },
  equippedCardBack: {
    type: String,
    default: 'classic'
  },
  equippedTableSkin: {
    type: String,
    default: 'classic_green'
  },
  inventory: {
    avatars: [String],
    cardBacks: [String],
    tableSkins: [String]
  },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    handsWon: { type: Number, default: 0 },
    kotCount: { type: Number, default: 0 }
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dailyRewardStreak: {
    type: Number,
    default: 0
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
