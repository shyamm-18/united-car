const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const { createNotification } = require('./notificationController');
const { sendEmail, templates } = require('../utils/mailHelper');
const { generateRentalAgreement } = require('../utils/pdfHelper');
const { PassThrough } = require('stream');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice, pickupLocation, addons, couponCode, useWallet } = req.body;

    if (!carId || !startDate || !endDate || !totalPrice || !pickupLocation) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    // 0. Manage Reductions (Coupons & Wallet)
    let finalAmount = totalPrice;
    let discountAmount = 0;
    let walletUsed = 0;

    // A. Handle Coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        // Verify eligibility (simple check for now, can be expanded)
        if (new Date(coupon.expiryDate) >= new Date()) {
           if (coupon.discountType === 'percentage') {
             discountAmount = (totalPrice * coupon.discountValue) / 100;
           } else {
             discountAmount = coupon.discountValue;
           }
           finalAmount -= discountAmount;
           
           // Mark coupon as used by this user
           coupon.usedBy.push({ user: req.user._id });
           await coupon.save();
        }
      }
    }

    // B. Handle Wallet
    if (useWallet) {
      const user = await User.findById(req.user._id);
      if (user.walletBalance > 0) {
        walletUsed = Math.min(user.walletBalance, finalAmount);
        user.walletBalance -= walletUsed;
        user.walletTransactions.push({
          amount: walletUsed,
          type: 'debit',
          description: `Booking payment for car rental`
        });
        await user.save();
        finalAmount -= walletUsed;
      }
    }

    // 0.5. Airbnb-style Live Calendar Constraint (Overlap Prevention)
    const existingBooking = await Booking.findOne({
      car: carId,
      status: { $ne: 'cancelled' },
      $or: [
        { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: 'These dates are no longer available for this vehicle. Please select a different time frame.' 
      });
    }

    const booking = new Booking({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      totalPrice, // Original price before wallet/coupon
      pickupLocation,
      addons,
      couponCode: couponCode || null,
      discountApplied: discountAmount,
      walletAmountApplied: walletUsed,
      finalPaidAmount: finalAmount // Amount left to be paid via gateway (or 0 if fully paid)
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

    // 3. Generate and Email Rental Agreement PDF
    try {
      const fullBooking = await Booking.findById(createdBooking._id)
        .populate('user', 'name email kycStatus')
        .populate('car', 'brand model type');

      const stream = new PassThrough();
      const buffers = [];
      stream.on('data', b => buffers.push(b));
      stream.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);
        const emailHtml = templates.bookingConfirmation(req.user.name, `${car.brand} ${car.model}`, startDate);
        
        await sendEmail(
          req.user.email, 
          'Rental Agreement & Confirmation - UNITED CAR', 
          emailHtml,
          [{
            filename: `Rental_Agreement_${createdBooking._id}.pdf`,
            content: pdfBuffer
          }]
        );
      });

      generateRentalAgreement(fullBooking, stream);
    } catch (err) {
      console.error('PDF Generation or Email failed:', err);
    }

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

// @desc    Get bookings for a specific car to block dates
// @route   GET /api/bookings/car/:id
// @access  Public
const getCarBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      car: req.params.id,
      status: { $ne: 'cancelled' }
    }).select('startDate endDate');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking agreement PDF
// @route   GET /api/bookings/:id/agreement
// @access  Private
const getBookingAgreement = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email kycStatus')
      .populate('car', 'brand model type');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Rental_Agreement_${booking._id}.pdf`);

    generateRentalAgreement(booking, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addBookingItems, getMyBookings, getBookings, cancelBooking, updateBookingTelemetry, getCarBookings, getBookingAgreement };
