const mongoose = require('mongoose');

const notificationSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    endpoint: { type: String, required: true },
    expirationTime: { type: Number, default: null },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true }
    }
  }
}, { timestamps: true });

// Ensure unique subscription per user per endpoint
notificationSubscriptionSchema.index({ user: 1, 'subscription.endpoint': 1 }, { unique: true });

const NotificationSubscription = mongoose.model('NotificationSubscription', notificationSubscriptionSchema);

module.exports = NotificationSubscription;
