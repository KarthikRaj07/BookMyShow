const express = require('express');
const router = express.Router();
const { createShow, getShowById, getShowsByMovie } = require('../controllers/showController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createShow);
router.get('/show/:id', getShowById);
router.get('/:movieId', getShowsByMovie);

module.exports = router;

