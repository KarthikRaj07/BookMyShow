const Booking = require('../models/Booking');
const Show = require('../models/Show');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { showId, seatsBooked, seatNumbers } = req.body;
    const userId = req.user._id;

    // Validation
    if (!showId || !seatsBooked) {
      return res.status(400).json({ message: 'Please provide show ID and number of seats' });
    }

    if (seatsBooked <= 0) {
      return res.status(400).json({ message: 'Seats booked must be greater than 0' });
    }

    // Check if show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Validate seat numbers if provided
    if (seatNumbers && Array.isArray(seatNumbers)) {
      // Check if any selected seats are already booked
      const bookedSeats = show.bookedSeats || [];
      const alreadyBooked = seatNumbers.filter(seat => bookedSeats.includes(seat));
      
      if (alreadyBooked.length > 0) {
        return res.status(400).json({ 
          message: `Seats ${alreadyBooked.join(', ')} are already booked` 
        });
      }

      // Validate seat count matches
      if (seatNumbers.length !== seatsBooked) {
        return res.status(400).json({ 
          message: 'Number of seats does not match selected seats' 
        });
      }
    }

    // Check seat availability
    if (show.availableSeats < seatsBooked) {
      return res.status(400).json({ 
        message: `Only ${show.availableSeats} seats available` 
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      showId,
      seatsBooked,
      seatNumbers: seatNumbers || [],
      bookingTime: new Date()
    });

    // Update available seats and booked seats
    show.availableSeats -= seatsBooked;
    if (seatNumbers && Array.isArray(seatNumbers)) {
      show.bookedSeats = [...(show.bookedSeats || []), ...seatNumbers];
    }
    await show.save();

    // Populate show and movie details
    await booking.populate({
      path: 'showId',
      populate: {
        path: 'movieId',
        select: 'title description duration language'
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid show ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'showId',
        populate: {
          path: 'movieId',
          select: 'title description duration language'
        }
      })
      .sort({ bookingTime: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getMyBookings
};

