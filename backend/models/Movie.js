const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in minutes']
  },
  language: {
    type: String,
    required: [true, 'Please provide language'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);

