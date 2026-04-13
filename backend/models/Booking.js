const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Car',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
    addons: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        type: { type: String, enum: ['per_day', 'one_time'], default: 'one_time' }
      }
    ],
    telemetry: {
      startKm: { type: Number, default: null },
      endKm: { type: Number, default: null },
      totalKm: { type: Number, default: null }
    }
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
