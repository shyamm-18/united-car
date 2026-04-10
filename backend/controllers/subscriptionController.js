const Subscription = require('../models/Subscription');
const Car = require('../models/Car');
const { createNotification } = require('./notificationController');

// @desc    Create a new subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
  try {
    const { carId, price } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Set end date to 30 days from now
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const subscription = new Subscription({
      user: req.user._id,
      car: carId,
      startDate,
      endDate,
      price,
      status: 'active'
    });

    const createdSubscription = await subscription.save();

    // Trigger Notification
    await createNotification(
      req.user._id,
      'Subscription Active!',
      `Welcome to UNITED CAR Unlimited! Your subscription for the ${car.brand} ${car.model} is now active.`,
      'success'
    );

    res.status(201).json(createdSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user subscriptions
// @route   GET /api/subscriptions/my
// @access  Private
const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).populate('car');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a subscription
// @route   PUT /api/subscriptions/:id/cancel
// @access  Private
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (subscription) {
      subscription.status = 'cancelled';
      subscription.autoRenew = false;
      await subscription.save();
      res.json({ message: 'Subscription cancelled. It will remain active until the end of the period.' });
    } else {
      res.status(404).json({ message: 'Subscription not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubscription, getMySubscriptions, cancelSubscription };
