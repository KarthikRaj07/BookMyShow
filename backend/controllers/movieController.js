const Movie = require('../models/Movie');

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res) => {
  try {
    const { title, description, duration, language } = req.body;

    // Validation
    if (!title || !description || !duration || !language) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const movie = await Movie.create({
      title,
      description,
      duration,
      language
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById
};

