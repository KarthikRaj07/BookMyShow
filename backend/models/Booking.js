const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID']
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: [true, 'Please provide show ID']
  },
  seatsBooked: {
    type: Number,
    required: [true, 'Please provide number of seats'],
    min: 1
  },
  seatNumbers: {
    type: [String],
    default: []
  },
  bookingTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

