const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar, getRecommendations, getTopRatedCars } = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');

router.get('/top', getTopRatedCars);

router.get('/recommendations', (req, res, next) => {
  // Allow optional auth for recommendations
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, getRecommendations);

router.route('/')
  .get(getCars)
  .post(protect, (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    res.status(401).json({ message: 'Not authorized as admin' });
  }, createCar);

router.route('/:id')
  .get(getCarById)
  .put(protect, (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    res.status(401).json({ message: 'Not authorized as admin' });
  }, updateCar)
  .delete(protect, (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    res.status(401).json({ message: 'Not authorized as admin' });
  }, deleteCar);

module.exports = router;
