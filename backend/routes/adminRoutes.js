const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, admin, getAnalytics);

module.exports = router;
