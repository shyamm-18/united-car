const Coupon = require('../models/Coupon');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  const { code, bookingValue } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon code has expired' });
    }

    // Check usage limit
    if (coupon.usedBy.length >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check if user already used it
    const alreadyUsed = coupon.usedBy.find(u => u.user.toString() === req.user._id.toString());
    if (alreadyUsed) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    // Check min booking amount
    if (bookingValue < coupon.minBookingAmount) {
      return res.status(400).json({ message: `Minimum booking amount for this coupon is ₹${coupon.minBookingAmount}` });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (bookingValue * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      couponCode: coupon.code,
      discountAmount: discount,
      message: 'Coupon applied successfully!'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, minBookingAmount, maxDiscountAmount, expiryDate, usageLimit } = req.body;

  try {
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscountAmount,
      expiryDate,
      usageLimit
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort('-createdAt');
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a coupon (e.g. toggle active)
// @route   PUT /api/coupons/:id
// @access  Admin
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { validateCoupon, createCoupon, getCoupons, updateCoupon, deleteCoupon };
