const mongoose = require('mongoose');
const Car = require('./models/Car');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const cars = await Car.find({});
  for (const car of cars) {
    const hasExterior = car.gallery.some(g => g.category === 'Exterior');
    if (!hasExterior && car.image) {
      await Car.findByIdAndUpdate(car._id, { 
        $push: { gallery: { url: car.image, category: 'Exterior' } } 
      });
      console.log('Restored Exterior image for:', car.brand, car.model);
    }
  }
  console.log('Successfully added Exterior images back to all car galleries.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
