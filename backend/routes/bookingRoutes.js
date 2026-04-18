const express = require('express');
const router = express.Router();
const { addBookingItems, getMyBookings, getBookings, cancelBooking, updateBookingTelemetry, getCarBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getBookings)
  .post(protect, addBookingItems);

router.get('/my-bookings', protect, getMyBookings);
router.get('/car/:id', getCarBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/telemetry', protect, admin, updateBookingTelemetry);

module.exports = router;
