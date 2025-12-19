const express = require('express');
const router = express.Router();
const { createMovie, getMovies, getMovieById } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createMovie);
router.get('/', getMovies);
router.get('/:id', getMovieById);

module.exports = router;

