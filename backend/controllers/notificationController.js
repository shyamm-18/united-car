const Notification = require('../models/Notification');
const User = require('../models/User');
const Car = require('../models/Car');
const { sendEmail, templates } = require('../utils/mailHelper');
const { sendSMS, smsTemplates } = require('../utils/smsHelper');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
       return res.status(401).json({ message: 'Authentication required for notifications' });
    }
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(notifications || []);
  } catch (error) {
    console.error('SERVER NOTIFICATION ERROR:', error);
    res.status(500).json({ message: 'Internal server error processing notifications' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.isRead = true;
      await notification.save();
      res.json({ message: 'Marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Private
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: 'Notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to create notification internally
const createNotification = async (userId, title, message, type = 'info', context = {}) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type
    });
    await notification.save();

    // Multi-channel dispatch
    const user = await User.findById(userId);
    if (!user) return;

    // 1. Email Dispatch
    if (user.notificationSettings?.email) {
      if (title === 'Booking Confirmed!') {
        await sendEmail(
          user.email,
          'Reservation Confirmed - UNITED CAR',
          templates.bookingConfirmation(user.name, context.carModel || 'your vehicle', context.startDate)
        );
      } else if (title === 'Payment Success!') {
        await sendEmail(user.email, 'Payment Received - UNITED CAR', `<p>Your payment was successful. Thank you!</p>`);
      } else if (context.isAdminAlert) {
        // High-Priority Admin Email Alert
        await sendEmail(
          user.email,
          `NEW BOOKING ALERT - $${context.revenue}`,
          `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #2563eb;">New Reservation Received!</h2>
              <p>Hello Admin,</p>
              <p>A new booking has been made on UNITED CAR:</p>
              <ul>
                <li><strong>Customer:</strong> ${context.customerName}</li>
                <li><strong>Vehicle:</strong> ${context.carModel}</li>
                <li><strong>Amount:</strong> $${context.revenue}</li>
              </ul>
              <p>Please check the Admin Dashboard for details.</p>
            </div>
          `
        );
      }
    }

    // 2. SMS Dispatch
    if (user.notificationSettings?.sms && user.phone) {
      if (title === 'Booking Confirmed!') {
        await sendSMS(user.phone, smsTemplates.bookingConfirmation(context.carModel || 'your vehicle'));
      }
    }

  } catch (error) {
    console.error('Notification creation failed', error);
  }
};

module.exports = { getNotifications, markAsRead, clearNotifications, createNotification };
