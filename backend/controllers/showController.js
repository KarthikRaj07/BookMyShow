const Show = require('../models/Show');
const Movie = require('../models/Movie');

// @desc    Create a new show
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res) => {
  try {
    const { movieId, theatre, showTime, totalSeats, availableSeats } = req.body;

    // Validation
    if (!movieId || !theatre || !showTime || !totalSeats || availableSeats === undefined) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Validate seats
    if (availableSeats > totalSeats) {
      return res.status(400).json({ message: 'Available seats cannot exceed total seats' });
    }

    const show = await Show.create({
      movieId,
      theatre,
      showTime,
      totalSeats,
      availableSeats
    });

    // Populate movie details
    await show.populate('movieId', 'title description duration language');

    res.status(201).json(show);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single show by ID
// @route   GET /api/shows/show/:id
// @access  Public
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title description duration language');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json(show);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid show ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get shows for a movie
// @route   GET /api/shows/:movieId
// @access  Public
const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movieId: req.params.movieId })
      .populate('movieId', 'title description duration language')
      .sort({ showTime: 1 });

    // Return empty array instead of 404 - this is more RESTful
    res.json(shows);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid movie ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createShow,
  getShowById,
  getShowsByMovie
};

