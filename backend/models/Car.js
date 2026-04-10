const mongoose = require('mongoose');

const carSchema = mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, required: true }, // SUV, Sedan, Hatchback, Luxury
    pricePerDay: { type: Number, required: true },
    image: { type: String, required: true },
    seats: { type: Number, required: true },
    transmission: { type: String, required: true, enum: ['Automatic', 'Manual'] },
    fuel: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    gallery: [
      {
        url: { type: String, required: true },
        category: { type: String, enum: ['Exterior', 'Interior', 'Detail'], default: 'Exterior' }
      }
    ],
    images360: [{ type: String }], // Array of URLs for 360 rotation
    location: {
      lat: { type: Number, default: 19.0760 },
      lng: { type: Number, default: 72.8777 },
      address: { type: String, default: 'Mumbai, Maharashtra' }
    },
    allowSubscription: { type: Boolean, default: false },
    monthlyPrice: { type: Number, default: 0 },
    telemetry: {
      speed: { type: Number, default: 0 },
      fuel: { type: Number, default: 100 },
      lastUpdated: { type: Date, default: Date.now }
    }
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
