import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MOCK_CARS } from './carsData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const carSchema = mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  image: { type: String, required: true },
  seats: { type: Number, required: true },
  transmission: { type: String, required: true },
  fuel: { type: String, required: true },
  rating: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  location: {
    lat: { type: Number, default: 19.0760 },
    lng: { type: Number, default: 72.8777 },
    address: { type: String }
  }
}, { timestamps: true });

// Prevent model overwrite runtime errors
const Car = mongoose.models.Car || mongoose.model('Car', carSchema);

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental';
    await mongoose.connect(uri);
    console.log('MongoDB Connected for FULL Seeding');

    await Car.deleteMany();
    console.log('Previous cars deleted');

    // MOCK_CARS contains all 15 cars but has frontend _id strings. Strip them!
    const itemsWithoutID = MOCK_CARS.map(car => {
       const clone = { ...car };
       delete clone._id;
       return clone;
    });

    await Car.insertMany(itemsWithoutID);
    console.log('All 15 Premium Cars seeded successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
