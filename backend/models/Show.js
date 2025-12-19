const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Please provide a movie ID']
  },
  theatre: {
    type: String,
    required: [true, 'Please provide theatre name'],
    trim: true
  },
  showTime: {
    type: Date,
    required: [true, 'Please provide show time']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    min: 1
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please provide available seats'],
    min: 0
  },
  bookedSeats: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Show', showSchema);

