const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const { sendEmail, templates } = require('../utils/mailHelper');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  let { name, email, password } = req.body;
  email = email.toLowerCase();

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: email === 'arebhai09@gmail.com' ? 'admin' : 'user',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  try {
    const user = await User.findOne({ email });
    
    // Auto-promote special master admin email
    if (user && user.email === 'arebhai09@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycStatus: user.kycStatus,
      documents: user.documents,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      kycStatus: updatedUser.kycStatus,
      documents: updatedUser.documents,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Submit KYC documents
// @route   PUT /api/auth/profile/kyc
// @access  Private
const submitKYC = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.documents = {
      idProofUrl: req.body.idProofUrl || user.documents?.idProofUrl,
      licenseUrl: req.body.licenseUrl || user.documents?.licenseUrl,
      submittedAt: new Date()
    };
    user.kycStatus = 'pending';

    const updatedUser = await user.save();
    res.json({
      kycStatus: updatedUser.kycStatus,
      documents: updatedUser.documents
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Verify KYC (Admin)
// @route   PUT /api/auth/users/:id/kyc
// @access  Private/Admin
const verifyKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.kycStatus = req.body.status; // 'verified' or 'rejected'
      const updatedUser = await user.save();
      res.json({ kycStatus: updatedUser.kycStatus });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete an admin user' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate and hash password token
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL pointing to FRONTEND (not backend)
    const frontendUrl = process.env.FRONTEND_URL || 'https://united-car.vercel.app';
    const resetUrl = `${frontendUrl}/resetpassword/${resetToken}`;
    
    const message = templates.passwordReset(user.name, resetUrl);

    try {
      await sendEmail(user.email, 'Password Reset Request', message);
      res.status(200).json({ 
        success: true, 
        message: 'Email sent'
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
    token: generateToken(user._id),
  });
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, deleteUser, submitKYC, verifyKYC, forgotPassword, resetPassword };
