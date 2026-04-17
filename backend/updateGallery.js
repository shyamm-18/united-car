const mongoose = require('mongoose');
const Car = require('./models/Car');
require('dotenv').config();

const updates = [
  { 
    id: '69da3080e9e541a64d75cf7c', 
    gallery: [
      { url: 'http://localhost:5000/uploads/swift_interior.png', category: 'Interior' }, 
      { url: 'http://localhost:5000/uploads/swift_detail.png', category: 'Detail' }
    ] 
  },
  { 
    id: '69da3080e9e541a64d75cf7d', 
    gallery: [
      { url: 'http://localhost:5000/uploads/thar_interior.png', category: 'Interior' }, 
      { url: 'http://localhost:5000/uploads/thar_detail.png', category: 'Detail' }
    ] 
  },
  { 
    id: '69da3080e9e541a64d75cf7e', 
    gallery: [
      { url: 'http://localhost:5000/uploads/fortuner_interior.png', category: 'Interior' }, 
      { url: 'http://localhost:5000/uploads/fortuner_detail.png', category: 'Detail' }
    ] 
  },
  { 
    id: '69da3080e9e541a64d75cf7f', 
    gallery: [
      { url: 'http://localhost:5000/uploads/fronx_interior.png', category: 'Interior' }
    ] 
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  for (const update of updates) {
    // Clear existing gallery and push new ones to avoid duplicates if rerun
    await Car.findByIdAndUpdate(update.id, { $set: { gallery: update.gallery } });
    console.log('Updated gallery for car:', update.id);
  }
  console.log('Gallery update complete!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
