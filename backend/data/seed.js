const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('../models/Car');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const cars = [
  {
    brand: 'Maruti Suzuki',
    model: 'Swift Dzire',
    type: 'Sedan',
    pricePerDay: 30,
    image: 'https://images.unsplash.com/photo-1594051064215-62cc3b5c3ca5?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    rating: 4.5,
    isAvailable: true
  },
  {
    brand: 'Mahindra',
    model: 'Thar',
    type: 'SUV',
    pricePerDay: 55,
    image: 'https://images.unsplash.com/photo-1623869675781-80aa3101235a?q=80&w=2000&auto=format&fit=crop',
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Diesel',
    rating: 4.8,
    isAvailable: true
  },
  {
    brand: 'Toyota',
    model: 'Fortuner',
    type: 'SUV',
    pricePerDay: 80,
    image: 'https://images.unsplash.com/photo-1620054707011-db75e8ee4a23?q=80&w=2000&auto=format&fit=crop',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Diesel',
    rating: 4.7,
    isAvailable: true
  },
  {
    brand: 'BMW',
    model: 'X5',
    type: 'Luxury',
    pricePerDay: 150,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.9,
    isAvailable: true
  },
  {
    brand: 'Audi',
    model: 'A6',
    type: 'Luxury',
    pricePerDay: 130,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.8,
    isAvailable: true
  },
  {
    brand: 'Mahindra',
    model: 'Scorpio',
    type: 'SUV',
    pricePerDay: 50,
    image: 'https://images.unsplash.com/photo-1634685350731-f1f33f0b8d5a?q=80&w=2000&auto=format&fit=crop',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Diesel',
    rating: 4.5,
    isAvailable: true
  },
  {
    brand: 'Hyundai',
    model: 'Verna',
    type: 'Sedan',
    pricePerDay: 40,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.4,
    isAvailable: true
  },
  {
    brand: 'Hyundai',
    model: 'Creta',
    type: 'SUV',
    pricePerDay: 45,
    image: 'https://images.unsplash.com/photo-1631584992524-74765fbfe0e9?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.6,
    isAvailable: true
  },
  {
    brand: 'Toyota',
    model: 'Innova',
    type: 'SUV',
    pricePerDay: 60,
    image: 'https://images.unsplash.com/photo-1581023773708-4122dace2aa3?q=80&w=2000&auto=format&fit=crop',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Diesel',
    rating: 4.7,
    isAvailable: true
  },
  {
    brand: 'Volkswagen',
    model: 'Polo',
    type: 'Hatchback',
    pricePerDay: 30,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Manual',
    fuel: 'Petrol',
    rating: 4.6,
    isAvailable: true
  },
  {
    brand: 'Hyundai',
    model: 'i20',
    type: 'Hatchback',
    pricePerDay: 32,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.3,
    isAvailable: true
  },
  {
    brand: 'Tata',
    model: 'Nexon',
    type: 'SUV',
    pricePerDay: 42,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.7,
    isAvailable: true
  },
  {
    brand: 'Mahindra',
    model: 'XUV700',
    type: 'SUV',
    pricePerDay: 58,
    image: 'https://images.unsplash.com/photo-1650361226027-2c9dd8de9c99?q=80&w=2000&auto=format&fit=crop',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.8,
    isAvailable: true
  },
  {
    brand: 'Kia',
    model: 'Seltos',
    type: 'SUV',
    pricePerDay: 48,
    image: 'https://images.unsplash.com/photo-1582315053147-de3e498c41cc?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Diesel',
    rating: 4.6,
    isAvailable: true
  },
  {
    brand: 'Honda',
    model: 'City',
    type: 'Sedan',
    pricePerDay: 45,
    image: 'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?q=80&w=2000&auto=format&fit=crop',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Petrol',
    rating: 4.5,
    isAvailable: true
  }
];

const importData = async () => {
  try {
    await Car.deleteMany();
    console.log('Cars Collection cleared');
    await Car.insertMany(cars);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
