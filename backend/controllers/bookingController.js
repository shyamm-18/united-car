const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice, addons } = req.body;

    if (!carId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    const booking = new Booking({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      totalPrice,
      addons,
    });

    const createdBooking = await booking.save();

    const car = await Car.findById(carId);

    // 1. Trigger Notification for the User
    await createNotification(
      req.user._id, 
      'Booking Confirmed!', 
      `Your rental for the ${car?.brand} ${car?.model} is confirmed. Prep is underway!`,
      'success',
      { carModel: `${car?.brand} ${car?.model}`, startDate }
    );

    // 2. Trigger Notification for ALL Admins (Admin Notification)
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
       await createNotification(
         admin._id,
         'New Booking Alert! 🚨',
         `A new booking has been placed by ${req.user.name} for the ${car?.brand} ${car?.model}.`,
         'info',
         { 
           isAdminAlert: true,
           customerName: req.user.name,
           carModel: `${car?.brand} ${car?.model}`,
           revenue: totalPrice
         }
       );
    }

    res.status(201).json(createdBooking);

    // Simulated "Payment Success" Notification (5sec delay)
    setTimeout(async () => {
       await createNotification(
         req.user._id,
         'Payment Success!',
         `Payment for your ${car?.brand} ${car?.model} was processed successfully.`,
         'success'
       );
    }, 5000);

    // Simulated "Car Arrived" Notification for Demo (30sec delay)
    setTimeout(async () => {
      try {
        await createNotification(
          req.user._id,
          'Car Arrived!',
          'Your vehicle has arrived at the pickup point. Enjoy your ride!',
          'info'
        );
      } catch (err) {
        console.error('Delayed notification failed', err);
      }
    }, 30000); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('car', 'brand model image type pricePerDay');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'id name email').populate('car', 'brand model image type pricePerDay');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (booking) {
      if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }
      
      booking.status = 'cancelled';
      await booking.save();
      res.json({ message: 'Booking cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a booking's telemetry (kilometers)
// @route   PUT /api/bookings/:id/telemetry
// @access  Private/Admin
const updateBookingTelemetry = async (req, res) => {
  try {
    const { startKm, endKm } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (!booking.telemetry) {
       booking.telemetry = {};
    }
    
    if (startKm !== undefined) booking.telemetry.startKm = startKm;
    if (endKm !== undefined) booking.telemetry.endKm = endKm;
    
    if (booking.telemetry.startKm && booking.telemetry.endKm) {
       booking.telemetry.totalKm = booking.telemetry.endKm - booking.telemetry.startKm;
    }
    
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addBookingItems, getMyBookings, getBookings, cancelBooking, updateBookingTelemetry };
