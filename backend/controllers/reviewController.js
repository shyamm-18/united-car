const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { carId, rating, comment } = req.body;

  try {
      const car = await Car.findById(carId);

      if (car) {
        // Check if user has a confirmed booking for this car
        const hasBooked = await Booking.findOne({
          user: req.user._id,
          car: carId,
          status: 'confirmed'
        });

        if (!hasBooked && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Only verified bookers can leave a review.' });
        }

        const alreadyReviewed = await Review.findOne({
          user: req.user._id,
          car: carId,
        });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Car already reviewed' });
      }

      const review = new Review({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        car: carId,
      });

      await review.save();

      // Recalculate Car Rating
      const reviews = await Review.find({ car: carId });
      car.numReviews = reviews.length;
      car.averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

      await car.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a car
// @route   GET /api/reviews/car/:carId
// @access  Public
const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getCarReviews };
