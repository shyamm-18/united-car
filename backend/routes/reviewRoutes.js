const express = require('express');
const router = express.Router();
const { createReview, getCarReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/car/:carId', getCarReviews);

module.exports = router;
