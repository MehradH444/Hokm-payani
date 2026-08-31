const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    unique: true,
    sparse: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  entryFee: {
    type: Number,
    default: 0
  },
  targetHands: {
    type: Number,
    enum: [2, 3, 5, 7, 9, 11, 13], // تعداد دست لازم برای برد بازی[span_1](start_span)[span_1](end_span)
    default: 7
  },
  status: {
    type: String,
    enum: ['WAITING', 'PLAYING', 'FINISHED'],
    default: 'WAITING'
  },
  players: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    socketId: String,
    position: Number, // 0: جنوب, 1: شرق, 2: شمال, 3: غرب
    team: Number // 0: تیم یک (جنوب و شمال), 1: تیم دو (شرق و غرب)
  }],
  currentHakemPosition: {
    type: Number,
    default: 0
  },
  hokmSuit: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GameRoom', gameRoomSchema);
