const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('../models/Car');

dotenv.config({ path: __dirname + '/../.env' });

const MOCK_CARS = [
  { 
    brand: 'Maruti Suzuki', model: 'Swift Dzire', type: 'Sedan', pricePerDay: 40, image: 'https://images.unsplash.com/photo-1581023773708-4122dace2aa3?q=80&w=2000&auto=format&fit=crop', seats: 5, transmission: 'Manual', fuel: 'Petrol', rating: 4.5, isAvailable: true, location: { lat: 19.0760, lng: 72.8777, address: 'Mumbai Central' }
  },
  { 
    brand: 'Mahindra', model: 'Thar', type: 'SUV', pricePerDay: 75, image: 'https://images.unsplash.com/photo-1616422285623-13ff0167c958?q=80&w=2000&auto=format&fit=crop', seats: 4, transmission: 'Manual', fuel: 'Diesel', rating: 4.9, isAvailable: true, location: { lat: 19.1136, lng: 72.8697, address: 'Andheri West' }
  },
  { 
    brand: 'Toyota', model: 'Fortuner', type: 'SUV', pricePerDay: 110, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000&auto=format&fit=crop', seats: 7, transmission: 'Automatic', fuel: 'Diesel', rating: 4.7, isAvailable: true, location: { lat: 19.0596, lng: 72.8295, address: 'Bandra West' }
  },
  { 
    brand: 'BMW', model: 'X5', type: 'Luxury', pricePerDay: 250, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2000&auto=format&fit=crop', seats: 5, transmission: 'Automatic', fuel: 'Petrol', rating: 4.9, isAvailable: true, location: { lat: 18.9218, lng: 72.8347, address: 'Colaba' }
  },
  { 
    brand: 'Audi', model: 'A6', type: 'Luxury', pricePerDay: 220, image: 'https://images.unsplash.com/photo-1606152424101-ad29bc8110ae?q=80&w=2000&auto=format&fit=crop', seats: 5, transmission: 'Automatic', fuel: 'Petrol', rating: 4.8, isAvailable: true, location: { lat: 19.0178, lng: 72.8478, address: 'Dadar' }
  },
  { 
    brand: 'Porsche', model: '911 Carrera', type: 'Sports', pricePerDay: 450, image: 'https://images.unsplash.com/photo-1503376712353-c5eb1b6c70ce?q=80&w=2000&auto=format&fit=crop', seats: 2, transmission: 'Automatic', fuel: 'Petrol', rating: 5.0, isAvailable: true, location: { lat: 19.0522, lng: 72.8315, address: 'Bandra Kurla Complex' }
  },
  { 
    brand: 'Mercedes-Benz', model: 'S-Class', type: 'Luxury', pricePerDay: 300, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2000&auto=format&fit=crop', seats: 5, transmission: 'Automatic', fuel: 'Hybrid', rating: 4.9, isAvailable: true, location: { lat: 18.9647, lng: 72.8138, address: 'Malabar Hill' }
  },
  { 
    brand: 'Tesla', model: 'Model S', type: 'Electric', pricePerDay: 180, image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000&auto=format&fit=crop', seats: 5, transmission: 'Automatic', fuel: 'Electric', rating: 4.8, isAvailable: true, location: { lat: 19.1176, lng: 72.9060, address: 'Powai' }
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car-rental';
    await mongoose.connect(uri);
    console.log('MongoDB Connected for Seeding');

    await Car.deleteMany();
    console.log('Previous cars deleted');

    await Car.insertMany(MOCK_CARS);
    console.log('Premium Cars seeded successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
