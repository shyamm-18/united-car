const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Car = require('../models/Car');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const syncAssets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connected to Database...');

    const assetsPath = path.join(__dirname, '..', 'data', 'fleetAssets.json');
    if (!fs.existsSync(assetsPath)) {
      console.error('❌ fleetAssets.json not found!');
      process.exit(1);
    }

    const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf8'));
    console.log(`📦 Loaded ${assets.length} vehicle profiles from JSON.`);

    for (const item of assets) {
      const { brand, model, mainImage, gallery, images360 } = item;
      
      const car = await Car.findOne({ 
        brand: { $regex: new RegExp(`^${brand}$`, 'i') }, 
        model: { $regex: new RegExp(`^${model}$`, 'i') } 
      });

      if (car) {
        car.image = mainImage;
        car.gallery = gallery;
        car.images360 = images360;
        
        await car.save();
        console.log(`✅ Updated: ${brand} ${model}`);
      } else {
        console.warn(`⚠️ Not Found in DB: ${brand} ${model} (Skipping...)`);
      }
    }

    console.log('\n✨ Asset Synchronization Complete!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Sync Error:', error);
    process.exit(1);
  }
};

syncAssets();
