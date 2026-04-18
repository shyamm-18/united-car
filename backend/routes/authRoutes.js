const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, deleteUser, submitKYC, verifyKYC, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/profile/kyc', protect, submitKYC);

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id')
  .delete(protect, admin, deleteUser);

router.put('/users/:id/kyc', protect, admin, verifyKYC);

router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
