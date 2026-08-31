const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true // مانند: جام قشم، جام ساوه
  },
  capacity: {
    type: Number,
    enum: [16, 32, 64, 128],
    default: 64
  },
  entryFee: {
    type: Number,
    required: true
  },
  prizes: {
    firstPlace: { type: Number, required: true },
    secondPlace: { type: Number, required: true },
    thirdPlace: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'REGISTERING', 'IN_PROGRESS', 'FINISHED'],
    default: 'UPCOMING'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);
